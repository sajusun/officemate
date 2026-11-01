const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/background/index.ts');
let code = fs.readFileSync(targetFile, 'utf8');

// 1. Ensure getSettings is imported
code = code.replace(
  "import { saveWorkspace, getWorkspaces } from '../lib/storage';",
  "import { saveWorkspace, getWorkspaces, getSettings } from '../lib/storage';"
);

// 2. Add Active Defense listener
const activeDefense = `
// Active Anti-Tamper Defense: Real-time storage surveillance
if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local' && changes['officemate_settings']) {
      await getSettings(); // Automatically validates signature and sanitizes if console hack detected
    }
  });
}
`;

if (!code.includes('Active Anti-Tamper Defense')) {
  code += activeDefense;
  fs.writeFileSync(targetFile, code, 'utf8');
  console.log('Added Active Anti-Tamper Defense to officemate background service worker.');
} else {
  console.log('Already present.');
}

