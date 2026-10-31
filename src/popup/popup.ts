import {
  getSettings,
  saveSettings,
  getWorkspaces,
  deleteWorkspace,
  activateLicenseKey,
  canGenerateDraft,
  incrementDraftCount
} from '../lib/storage';
import { generateAIDraft } from '../lib/aiDrafts';
import { EmailTone } from '../lib/types';

document.addEventListener('DOMContentLoaded', async () => {
  let settings = await getSettings();

  const planBadge = document.getElementById('plan-badge') as HTMLDivElement;
  const stashInput = document.getElementById('stash-name-input') as HTMLInputElement;
  const btnPopupStash = document.getElementById('btn-popup-stash') as HTMLButtonElement;
  const workspacesList = document.getElementById('popup-workspaces-list') as HTMLDivElement;
  const workspacesCount = document.getElementById('workspaces-count') as HTMLSpanElement;

  const toneSelect = document.getElementById('draft-tone-select') as HTMLSelectElement;
  const notesInput = document.getElementById('draft-notes-input') as HTMLTextAreaElement;
  const btnGenerate = document.getElementById('btn-popup-generate') as HTMLButtonElement;
  const copiedMsg = document.getElementById('draft-copied-msg') as HTMLDivElement;

  const settingName = document.getElementById('setting-name') as HTMLInputElement;
  const settingTitle = document.getElementById('setting-title') as HTMLInputElement;
  const settingAiProvider = document.getElementById('setting-ai-provider') as HTMLSelectElement;
  const groupApiKey = document.getElementById('group-api-key') as HTMLDivElement;
  const settingApiKey = document.getElementById('setting-api-key') as HTMLInputElement;
  const settingLicenseKey = document.getElementById('setting-license-key') as HTMLInputElement;
  const btnActivatePro = document.getElementById('btn-activate-pro') as HTMLButtonElement;
  const btnOpenSidebar = document.getElementById('btn-open-inpage-sidebar') as HTMLButtonElement;

  const bannerBuyPro = document.getElementById('banner-buy-pro') as HTMLAnchorElement | null;

  // Custom Modal & Toast Elements
  const modalBackdrop = document.getElementById('custom-modal-backdrop') as HTMLDivElement;
  const modalIcon = document.getElementById('modal-icon') as HTMLSpanElement;
  const modalTitle = document.getElementById('modal-title') as HTMLHeadingElement;
  const modalMessage = document.getElementById('modal-message') as HTMLParagraphElement;
  const modalBtnClose = document.getElementById('modal-btn-close') as HTMLButtonElement;
  const modalBtnOk = document.getElementById('modal-btn-ok') as HTMLButtonElement;
  const modalBtnPro = document.getElementById('modal-btn-pro') as HTMLAnchorElement;
  const popupToast = document.getElementById('popup-toast') as HTMLDivElement;

  function showCustomDialog(options: {
    title: string;
    message: string;
    icon?: string;
    showProBtn?: boolean;
    onClose?: () => void;
  }) {
    modalIcon.textContent = options.icon || 'ℹ️';
    modalTitle.textContent = options.title;
    modalMessage.textContent = options.message;
    modalBtnPro.style.display = options.showProBtn ? 'inline-flex' : 'none';
    modalBackdrop.style.display = 'flex';

    const closeHandler = () => {
      modalBackdrop.style.display = 'none';
      modalBtnClose.removeEventListener('click', closeHandler);
      modalBtnOk.removeEventListener('click', closeHandler);
      if (options.onClose) options.onClose();
    };

    modalBtnClose.addEventListener('click', closeHandler);
    modalBtnOk.addEventListener('click', closeHandler);
  }

  function showToast(msg: string) {
    popupToast.textContent = msg;
    popupToast.style.display = 'block';
    setTimeout(() => {
      popupToast.style.display = 'none';
    }, 2500);
  }

  function updatePlanUI() {
    if (settings.isPro) {
      planBadge.className = 'badge-pro';
      planBadge.textContent = '👑 PRO';
      if (bannerBuyPro) bannerBuyPro.style.display = 'none';
    } else {
      planBadge.className = 'badge-free';
      planBadge.textContent = 'FREE';
      if (bannerBuyPro) bannerBuyPro.style.display = 'flex';
    }
  }
  updatePlanUI();

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      document.getElementById(`panel-${tab}`)?.classList.add('active');
    });
  });

  // Stash Tabs from Popup
  btnPopupStash.addEventListener('click', () => {
    const name = stashInput.value.trim() || `Workspace ${new Date().toLocaleDateString()}`;
    btnPopupStash.disabled = true;

    chrome.runtime.sendMessage({ action: 'STASH_TABS', name }, (res) => {
      btnPopupStash.disabled = false;
      if (res?.success) {
        stashInput.value = '';
        renderWorkspaces();
        showToast(`Stashed ${res.count || 'all'} tabs!`);
      } else {
        showCustomDialog({
          title: 'Workspace Notice',
          icon: '⚠️',
          message: res?.message || 'Could not stash workspace.',
          showProBtn: Boolean(res?.message?.includes('Pro'))
        });
      }
    });
  });

  // Render Workspaces
  async function renderWorkspaces() {
    const list = await getWorkspaces();
    workspacesCount.textContent = String(list.length);

    if (list.length === 0) {
      workspacesList.innerHTML = `<div style="text-align: center; color: #64748b; font-size: 12px; padding: 20px 0;">No saved workspaces yet.</div>`;
      return;
    }

    workspacesList.innerHTML = list.map((ws) => `
      <div class="workspace-item" data-id="${ws.id}">
        <div>
          <strong style="color: #f8fafc; font-size: 12.5px; display: block;">${ws.name}</strong>
          <span style="color: #94a3b8; font-size: 11px;">${ws.tabs.length} tabs</span>
        </div>
        <div style="display: flex; gap: 4px;">
          <button class="action-btn primary btn-restore" style="padding: 4px 8px; font-size: 11px;">🚀 Open</button>
          <button class="action-btn btn-del" style="padding: 4px 8px; font-size: 11px; color: #ef4444;">✕</button>
        </div>
      </div>
    `).join('');

    workspacesList.querySelectorAll('.btn-restore').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const ws = list[idx];
        chrome.runtime.sendMessage({ action: 'RESTORE_WORKSPACE', tabs: ws.tabs });
        window.close();
      });
    });

    workspacesList.querySelectorAll('.btn-del').forEach((btn, idx) => {
      btn.addEventListener('click', async () => {
        const ws = list[idx];
        await deleteWorkspace(ws.id);
        renderWorkspaces();
      });
    });
  }
  renderWorkspaces();

  // Quick Draft from Popup
  btnGenerate.addEventListener('click', async () => {
    const { allowed } = await canGenerateDraft();
    if (!allowed) {
      showCustomDialog({
        title: 'Daily Limit Reached',
        icon: '👑',
        message: 'Daily free email draft limit (3 drafts) reached!\n\nUpgrade to OfficeMate Pro for unlimited drafts, tab workspaces, and priority AI features.',
        showProBtn: true
      });
      return;
    }

    btnGenerate.disabled = true;
    btnGenerate.textContent = 'Generating...';

    const tone = toneSelect.value as EmailTone;
    const notes = notesInput.value.trim();
    const draft = await generateAIDraft(tone, { incomingText: notes }, settings);
    await incrementDraftCount();

    navigator.clipboard.writeText(draft);
    btnGenerate.disabled = false;
    btnGenerate.textContent = '⚡ Generate & Copy Draft';
    copiedMsg.style.display = 'block';
    setTimeout(() => {
      copiedMsg.style.display = 'none';
    }, 3000);
  });

  // Settings
  settingName.value = settings.userFullName || '';
  settingTitle.value = `${settings.userJobTitle || ''}${settings.companyName ? `, ${settings.companyName}` : ''}`;
  settingAiProvider.value = settings.aiProvider || 'offline';
  settingApiKey.value = settings.aiApiKey || '';

  const apiKeyLink = document.getElementById('api-key-link') as HTMLAnchorElement | null;

  const updateKeyVisibility = () => {
    const isOffline = settingAiProvider.value === 'offline';
    groupApiKey.style.display = isOffline ? 'none' : 'block';

    if (apiKeyLink) {
      if (settingAiProvider.value === 'openai') {
        apiKeyLink.href = 'https://platform.openai.com/api-keys';
        apiKeyLink.textContent = 'Get OpenAI Key ↗';
        settingApiKey.placeholder = 'sk-...';
      } else if (settingAiProvider.value === 'gemini') {
        apiKeyLink.href = 'https://aistudio.google.com/app/apikey';
        apiKeyLink.textContent = 'Get Gemini Key ↗';
        settingApiKey.placeholder = 'AIzaSy...';
      }
    }
  };
  updateKeyVisibility();

  settingAiProvider.addEventListener('change', async () => {
    updateKeyVisibility();
    await saveSettings({ aiProvider: settingAiProvider.value as any });
  });

  settingName.addEventListener('change', async () => {
    await saveSettings({ userFullName: settingName.value.trim() });
  });

  settingTitle.addEventListener('change', async () => {
    const val = settingTitle.value.trim();
    const parts = val.split(',');
    await saveSettings({
      userJobTitle: parts[0]?.trim() || '',
      companyName: parts[1]?.trim() || ''
    });
  });

  settingApiKey.addEventListener('change', async () => {
    await saveSettings({ aiApiKey: settingApiKey.value.trim() });
  });

  btnActivatePro.addEventListener('click', async () => {
    const key = settingLicenseKey.value.trim();
    if (!key) return;
    const res = await activateLicenseKey(key);
    if (res.success) {
      settings = await getSettings();
      updatePlanUI();
      settingLicenseKey.value = '';
      showCustomDialog({
        title: 'Pro Activated',
        icon: '🎉',
        message: res.message
      });
    } else {
      showCustomDialog({
        title: 'Activation Failed',
        icon: '❌',
        message: res.message,
        showProBtn: true
      });
    }
  });

  // Launch Sidebar in Active Tab
  btnOpenSidebar.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url) {
      showToast('No active tab detected.');
      return;
    }

    // Check for restricted URLs where browser extensions cannot inject scripts
    const isRestricted =
      tab.url.startsWith('chrome://') ||
      tab.url.startsWith('edge://') ||
      tab.url.startsWith('about:') ||
      tab.url.includes('microsoftedge.microsoft.com') ||
      tab.url.includes('chrome.google.com/webstore');

    if (isRestricted) {
      showCustomDialog({
        title: 'Page Not Supported',
        icon: '⚠️',
        message:
          'OfficeMate Copilot cannot run on internal browser pages (edge:// or web store pages).\n\nPlease navigate to a regular web page (e.g. Outlook, Teams, Google, or any website) to use the sidebar.'
      });
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_SIDEBAR' }, (res) => {
      if (chrome.runtime.lastError || !res?.success) {
        // Content script wasn't active yet on this tab, inject dynamically
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id! },
            files: ['content.js']
          },
          () => {
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id!, { action: 'TOGGLE_SIDEBAR' });
              window.close();
            }, 120);
          }
        );
      } else {
        window.close();
      }
    });
  });
});
