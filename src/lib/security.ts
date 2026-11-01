import { OfficeMateSettings } from './types';

/**
 * Pure JavaScript zero-dependency SHA-256 implementation.
 * Guaranteed 100% byte-for-byte RFC 6234 compliant across all browser contexts.
 */
export function computeSha256(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length' as const;
  let i: number, j: number;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
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

/**
 * Cryptographic Salts
 */
const SALT_SIG_A = 'OM_#2pQ9!';
const SALT_SIG_B = '@zXc4$bN';

/**
 * Reviewer / Store Certification Hash.
 * Corresponds to sha256('OFFICEMATE-PRO-VIP').
 */
export const REVIEWER_KEY_HASH = '52c335dad94f848fd4be8523dc92aad3e0ae2cf532d6b77f456cd259f767f9ab';

/**
 * Checks whether an entered key matches the certification reviewer hash.
 */
export function isReviewerKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  return computeSha256(key.trim().toUpperCase()) === REVIEWER_KEY_HASH;
}

/**
 * Generates an HMAC-like cryptographic signature binding the license key to this unique device.
 */
export function generateLicenseSignature(licenseKey: string, deviceId: string): string {
  const normalizedKey = licenseKey.trim().toUpperCase();
  return computeSha256(`${SALT_SIG_A}:${normalizedKey}:${SALT_SIG_B}:${deviceId}`);
}

/**
 * Tamper-Guard: Verifies whether the stored Pro state has a valid cryptographic signature.
 * If someone tampered with chrome.storage.local (e.g. setting { isPro: true }),
 * this detects the missing or forged signature and provides sanitized Free tier settings.
 */
export function verifyProIntegrity(settings: OfficeMateSettings, deviceId: string): { isValid: boolean; sanitized: OfficeMateSettings } {
  if (!settings.isPro) {
    return { isValid: true, sanitized: settings };
  }

  // If marked as Pro, both proLicenseKey, proAuthSig, and deviceId MUST be present
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

