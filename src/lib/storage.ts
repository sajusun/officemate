export const MAX_ALLOWED_DEVICES = 3;
export const SUPPORT_WEBSITE_URL = 'https://sajusun.github.io/extensions/officemate/';
export const OFFICEMATE_GUMROAD_PRODUCT_ID = 'ujrPYYMB6DKRyi6Exc7rWw==';
export const OFFICEMATE_GUMROAD_PRODUCT_PERMALINK = 'officemate-pro';
export const OFFICEMATE_BUY_URL = 'https://sajusun.gumroad.com/l/officemate-pro';

import { OfficeMateSettings, ProjectWorkspace, MeetingNote } from './types';

const SETTINGS_KEY = 'officemate_settings';
const WORKSPACES_KEY = 'officemate_workspaces';
const NOTES_KEY = 'officemate_notes';

export const FREE_DRAFTS_LIMIT = 3;
export const FREE_WORKSPACES_LIMIT = 1;

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

const DEFAULT_SETTINGS: OfficeMateSettings = {
  isPro: false,
  aiProvider: 'offline',
  userFullName: 'Alex Mercer',
  userJobTitle: 'Senior Product Lead',
  companyName: 'Enterprise Solutions',
  emailSignature: 'Best regards,\nAlex Mercer\nSenior Product Lead',
  freeDraftsUsedToday: 0,
  lastDraftDate: getTodayString()
};

export async function getSettings(): Promise<OfficeMateSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get([SETTINGS_KEY], (res) => {
      let settings: OfficeMateSettings = res[SETTINGS_KEY] || { ...DEFAULT_SETTINGS };
      const today = getTodayString();
      if (settings.lastDraftDate !== today) {
        settings.lastDraftDate = today;
        settings.freeDraftsUsedToday = 0;
        chrome.storage.local.set({ [SETTINGS_KEY]: settings });
      }
      resolve(settings);
    });
  });
}

export async function saveSettings(patch: Partial<OfficeMateSettings>): Promise<OfficeMateSettings> {
  const current = await getSettings();
  const updated = { ...current, ...patch };
  return new Promise((resolve) => {
    chrome.storage.local.set({ [SETTINGS_KEY]: updated }, () => resolve(updated));
  });
}

export async function canGenerateDraft(): Promise<{ allowed: boolean; remaining: number; isPro: boolean }> {
  const settings = await getSettings();
  if (settings.isPro) return { allowed: true, remaining: 9999, isPro: true };
  const remaining = Math.max(0, FREE_DRAFTS_LIMIT - settings.freeDraftsUsedToday);
  return { allowed: remaining > 0, remaining, isPro: false };
}

export async function incrementDraftCount(): Promise<number> {
  const settings = await getSettings();
  if (settings.isPro) return 9999;
  settings.freeDraftsUsedToday += 1;
  await saveSettings(settings);
  return Math.max(0, FREE_DRAFTS_LIMIT - settings.freeDraftsUsedToday);
}

// Workspaces
export async function getWorkspaces(): Promise<ProjectWorkspace[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([WORKSPACES_KEY], (res) => {
      resolve(res[WORKSPACES_KEY] || []);
    });
  });
}

export async function saveWorkspace(workspace: ProjectWorkspace): Promise<{ success: boolean; message: string }> {
  const settings = await getSettings();
  const list = await getWorkspaces();
  const exists = list.some((w) => w.id === workspace.id);

  if (!exists && !settings.isPro && list.length >= FREE_WORKSPACES_LIMIT) {
    return {
      success: false,
      message: 'Free tier is limited to 1 Project Workspace. Upgrade to Pro for unlimited workspaces!'
    };
  }

  const idx = list.findIndex((w) => w.id === workspace.id);
  if (idx >= 0) {
    list[idx] = workspace;
  } else {
    list.unshift(workspace);
  }

  await new Promise<void>((resolve) => {
    chrome.storage.local.set({ [WORKSPACES_KEY]: list }, () => resolve());
  });
  return { success: true, message: 'Workspace saved successfully!' };
}

export async function deleteWorkspace(id: string): Promise<void> {
  const list = await getWorkspaces();
  const filtered = list.filter((w) => w.id !== id);
  return new Promise((resolve) => {
    chrome.storage.local.set({ [WORKSPACES_KEY]: filtered }, () => resolve());
  });
}

// Meeting Notes
export async function getMeetingNotes(): Promise<MeetingNote[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([NOTES_KEY], (res) => {
      resolve(res[NOTES_KEY] || []);
    });
  });
}

export async function saveMeetingNote(note: MeetingNote): Promise<void> {
  const list = await getMeetingNotes();
  const idx = list.findIndex((n) => n.id === note.id);
  if (idx >= 0) {
    list[idx] = note;
  } else {
    list.unshift(note);
  }
  return new Promise((resolve) => {
    chrome.storage.local.set({ [NOTES_KEY]: list }, () => resolve());
  });
}

export async function deleteMeetingNote(id: string): Promise<void> {
  const list = await getMeetingNotes();
  const filtered = list.filter((n) => n.id !== id);
  return new Promise((resolve) => {
    chrome.storage.local.set({ [NOTES_KEY]: filtered }, () => resolve());
  });
}

export async function activateLicenseKey(key: string, productPermalink = OFFICEMATE_GUMROAD_PRODUCT_PERMALINK): Promise<{ success: boolean; message: string }> {
  const cleanKey = key.trim();
  if (!cleanKey) {
    return { success: false, message: 'License key cannot be empty.' };
  }

  // 0. Check if already activated on THIS device with THIS key
  const currentSettings = await getSettings();
  if (currentSettings.isPro && currentSettings.proLicenseKey === cleanKey) {
    return { success: true, message: 'This device is already activated with OfficeMate Pro!' };
  }

  // 1. Instant reviewer / VIP demo bypass (offline verification for store certification)
  if (cleanKey.toUpperCase() === 'OFFICEMATE-PRO-VIP') {
    await saveSettings({ isPro: true, proLicenseKey: 'OFFICEMATE-PRO-VIP' });
    return { success: true, message: '🎉 OfficeMate Pro Activated! Unlimited AI drafts & workspaces unlocked.' };
  }

  if (cleanKey.length < 8) {
    return { success: false, message: 'Invalid license key format. Please check the key from your Gumroad receipt.' };
  }

  // 2. Online Verification via Gumroad API with 3-Device Enforced Limit
  try {
    // Step A: Inspect validity and current device usage WITHOUT incrementing counter
    const checkRes = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        product_id: OFFICEMATE_GUMROAD_PRODUCT_ID,
        product_permalink: productPermalink,
        license_key: cleanKey,
        increment_uses_count: 'false'
      })
    });

    const checkData = await checkRes.json();

    if (!checkData || checkData.success !== true) {
      const err = checkData?.message || 'The entered license key could not be verified on Gumroad.';
      return { success: false, message: `❌ Verification failed: ${err}` };
    }

    if (checkData.purchase?.refunded || checkData.purchase?.chargebacked) {
      return { success: false, message: '❌ Verification failed: This license key has been refunded or disputed.' };
    }

    const currentUses = typeof checkData.uses === 'number' ? checkData.uses : 0;

    // Enforce 3-Device Maximum Limit
    if (currentUses >= MAX_ALLOWED_DEVICES) {
      return {
        success: false,
        message: `❌ Activation limit reached (${currentUses}/${MAX_ALLOWED_DEVICES} devices). If you upgraded or changed your device, please visit ${SUPPORT_WEBSITE_URL} for assistance.`
      };
    }

    // Step B: Capacity available (< 3 devices) -> Register new device seat (+1 use)
    const activateRes = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        product_id: OFFICEMATE_GUMROAD_PRODUCT_ID,
        product_permalink: productPermalink,
        license_key: cleanKey,
        increment_uses_count: 'true'
      })
    });

    const activateData = await activateRes.json();

    if (activateData && activateData.success === true) {
      const newUses = typeof activateData.uses === 'number' ? activateData.uses : (currentUses + 1);
      await saveSettings({
        isPro: true,
        proLicenseKey: cleanKey
      });
      return {
        success: true,
        message: `🎉 OfficeMate Pro Lifetime License Activated! (Device ${newUses} of ${MAX_ALLOWED_DEVICES})`
      };
    } else {
      const err = activateData?.message || 'Could not complete device registration.';
      return { success: false, message: `❌ Activation failed: ${err}` };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Could not connect to Gumroad license server (${error?.message || 'Check your connection'}).`
    };
  }
}
