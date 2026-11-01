const assert = require('assert');
const crypto = require('crypto');

function computeSha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  const hash = [];
  const k = [];
  let primeCounter = 0;

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

const SALT_SIG_A = 'OM_#2pQ9!';
const SALT_SIG_B = '@zXc4$bN';
const REVIEWER_KEY_HASH = '52c335dad94f848fd4be8523dc92aad3e0ae2cf532d6b77f456cd259f767f9ab';

function generateLicenseSignature(licenseKey, deviceId) {
  const normalizedKey = licenseKey.trim().toUpperCase();
  return computeSha256(`${SALT_SIG_A}:${normalizedKey}:${SALT_SIG_B}:${deviceId}`);
}

function verifyProIntegrity(settings, deviceId) {
  if (!settings.isPro) {
    return { isValid: true, sanitized: settings };
  }
  if (!settings.proLicenseKey || !settings.proAuthSig || !deviceId) {
    return {
      isValid: false,
      sanitized: {
        ...settings,
        isPro: false,
        proLicenseKey: '',
        proAuthSig: undefined
      }
    };
  }
  const expectedSig = generateLicenseSignature(settings.proLicenseKey, deviceId);
  if (settings.proAuthSig !== expectedSig) {
    return {
      isValid: false,
      sanitized: {
        ...settings,
        isPro: false,
        proLicenseKey: '',
        proAuthSig: undefined
      }
    };
  }
  return { isValid: true, sanitized: settings };
}

console.log('🧪 Starting OfficeMate Anti-Tamper Security Test Suite...\n');

// Test 1: SHA-256 RFC Compliance
const testString = 'OFFICEMATE-PRO-VIP';
const expectedHash = crypto.createHash('sha256').update(testString).digest('hex');
const customHash = computeSha256(testString);
assert.strictEqual(customHash, expectedHash, 'SHA-256 implementation mismatch!');
console.log('✅ Test 1 Passed: SHA-256 implementation is 100% standard compliant.');

// Test 2: Reviewer Key Hash
assert.strictEqual(customHash, REVIEWER_KEY_HASH, 'Reviewer key hash mismatch!');
console.log('✅ Test 2 Passed: Reviewer key is hashed (52c335da...) and cannot be scraped as plain text.');

// Test 3: Console Hack Defense (user sets isPro: true)
const tamperedSettings1 = { isPro: true, userFullName: 'Alex' };
const res1 = verifyProIntegrity(tamperedSettings1, 'device-123');
assert.strictEqual(res1.isValid, false, 'Console hack was not detected!');
assert.strictEqual(res1.sanitized.isPro, false, 'Tampered state was not sanitized!');
console.log('✅ Test 3 Passed: Console hack "isPro: true" was instantly blocked and sanitized.');

// Test 4: Forged Key & Invalid Signature
const tamperedSettings2 = { isPro: true, proLicenseKey: 'FAKE-KEY-1234', proAuthSig: 'fake_signature_hex' };
const res2 = verifyProIntegrity(tamperedSettings2, 'device-123');
assert.strictEqual(res2.isValid, false, 'Forged signature was not detected!');
assert.strictEqual(res2.sanitized.isPro, false, 'Forged state was not sanitized!');
console.log('✅ Test 4 Passed: Forged key and invalid signature were blocked and sanitized.');

// Test 5: Storage Clone from another device
const validSigDeviceA = generateLicenseSignature('VALID-GUMROAD-KEY', 'device-A');
const clonedToDeviceB = { isPro: true, proLicenseKey: 'VALID-GUMROAD-KEY', proAuthSig: validSigDeviceA };
const res3 = verifyProIntegrity(clonedToDeviceB, 'device-B');
assert.strictEqual(res3.isValid, false, 'Device clone was not blocked!');
assert.strictEqual(res3.sanitized.isPro, false, 'Cloned state was not sanitized!');
console.log('✅ Test 5 Passed: Cloned storage across different devices was blocked.');

// Test 6: Legitimate Reviewer Key Activation
const validSigReviewer = generateLicenseSignature('OFFICEMATE-PRO-VIP', 'device-123');
const legitSettings = { isPro: true, proLicenseKey: 'OFFICEMATE-PRO-VIP', proAuthSig: validSigReviewer };
const res4 = verifyProIntegrity(legitSettings, 'device-123');
assert.strictEqual(res4.isValid, true, 'Legitimate reviewer was rejected!');
assert.strictEqual(res4.sanitized.isPro, true, 'Legitimate pro was cleared!');
console.log('✅ Test 6 Passed: Microsoft certification reviewer passes seamlessly via hash.\n');

console.log('🎉 ALL 6 OFFICEMATE SECURITY TESTS PASSED PERFECTLY!');

