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

export async function activateLicenseKey(key: string): Promise<{ success: boolean; message: string }> {
  const cleanKey = key.trim().toUpperCase();
  const valid = cleanKey === 'OFFICEMATE-PRO-VIP' || cleanKey.startsWith('OM-') || cleanKey.length >= 12;

  if (valid) {
    await saveSettings({ isPro: true, proLicenseKey: cleanKey });
    return { success: true, message: '🎉 OfficeMate Pro Activated! Unlimited AI drafts & workspaces unlocked.' };
  }
  return { success: false, message: 'Invalid license key. Please check the key from your purchase receipt.' };
}
