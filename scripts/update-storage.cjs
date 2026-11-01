const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/lib/storage.ts');
let code = fs.readFileSync(targetFile, 'utf8');

const targetStr = "export async function getSettings(): Promise<OfficeMateSettings> {";

const deviceIdCode = `const DEVICE_ID_KEY = 'officemate_device_id';

export async function getOrCreateDeviceId(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.local.get([DEVICE_ID_KEY], (res) => {
      let id = res[DEVICE_ID_KEY];
      if (!id) {
        const entropy = [
          typeof navigator !== 'undefined' ? navigator.userAgent : '',
          typeof navigator !== 'undefined' ? navigator.language : '',
          typeof screen !== 'undefined' ? \`\${screen.width}x\${screen.height}\` : '',
          Date.now().toString(),
          Math.random().toString(36).substring(2)
        ].join('|');
        id = 'om-dev-' + computeSha256(entropy).substring(0, 16);
        chrome.storage.local.set({ [DEVICE_ID_KEY]: id });
      }
      resolve(id);
    });
  });
}

export async function getSettings(): Promise<OfficeMateSettings> {
  const deviceId = await getOrCreateDeviceId();
  return new Promise((resolve) => {
    chrome.storage.local.get([SETTINGS_KEY], (res) => {
      let raw: OfficeMateSettings = res[SETTINGS_KEY] || { ...DEFAULT_SETTINGS };
      const { isValid, sanitized } = verifyProIntegrity(raw, deviceId);
      if (!isValid) {
        chrome.storage.local.set({ [SETTINGS_KEY]: sanitized });
      }
      const today = getTodayString();
      if (sanitized.lastDraftDate !== today) {
        sanitized.lastDraftDate = today;
        sanitized.freeDraftsUsedToday = 0;
        chrome.storage.local.set({ [SETTINGS_KEY]: sanitized });
      }
      resolve(sanitized);
    });
  });
}

function _unusedOldGetSettings(): Promise<OfficeMateSettings> {`;

if (!code.includes('export async function getOrCreateDeviceId')) {
  code = code.replace(targetStr, deviceIdCode);
  fs.writeFileSync(targetFile, code, 'utf8');
  console.log('Placed getOrCreateDeviceId above getSettings in officemate storage.ts');
} else {
  console.log('Already present');
}
