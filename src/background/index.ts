import { saveWorkspace, getWorkspaces } from '../lib/storage';
import { ProjectWorkspace, TabItem } from '../lib/types';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'officemate_parent',
    title: 'OfficeMate Copilot',
    contexts: ['page', 'selection']
  });

  chrome.contextMenus.create({
    id: 'officemate_stash_tabs',
    parentId: 'officemate_parent',
    title: '🗂️ Stash All Project Tabs',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'officemate_grab_actions',
    parentId: 'officemate_parent',
    title: '📌 Grab Action Items from Selection',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'officemate_open_sidebar',
    parentId: 'officemate_parent',
    title: '⚡ Open OfficeMate Sidebar',
    contexts: ['page']
  });

  console.log('⚡ OfficeMate for Edge Background Worker installed.');
});

function sendToggleSidebar(tabId: number) {
  chrome.tabs.sendMessage(tabId, { action: 'TOGGLE_SIDEBAR' }, () => {
    if (chrome.runtime.lastError) {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ['content.js']
        },
        () => {
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { action: 'TOGGLE_SIDEBAR' });
          }, 100);
        }
      );
    }
  });
}

// Context Menus
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || !tab.url) return;
  if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) return;

  if (info.menuItemId === 'officemate_open_sidebar') {
    sendToggleSidebar(tab.id);
  } else if (info.menuItemId === 'officemate_stash_tabs') {
    await stashCurrentWindowTabs('Quick Stash');
  }
});

// Keyboard Commands
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) return;
  if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) return;

  if (command === 'toggle_officemate_sidebar') {
    sendToggleSidebar(tab.id);
  } else if (command === 'quick_stash_workspace') {
    await stashCurrentWindowTabs('Stashed Workspace');
  }
});

// Stash function
async function stashCurrentWindowTabs(name: string): Promise<{ success: boolean; count: number; message?: string }> {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const stashedItems: TabItem[] = [];
  const tabIdsToClose: number[] = [];

  for (const t of tabs) {
    if (!t.url || t.url.startsWith('edge://') || t.url.startsWith('chrome://')) continue;
    stashedItems.push({
      title: t.title || 'Tab',
      url: t.url,
      favIconUrl: t.favIconUrl
    });
    if (t.id) tabIdsToClose.push(t.id);
  }

  if (stashedItems.length === 0) {
    return { success: false, count: 0, message: 'No standard web tabs to stash in this window.' };
  }

  const workspace: ProjectWorkspace = {
    id: 'ws_' + Date.now(),
    name,
    color: '#0078d4',
    tabs: stashedItems,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const saveRes = await saveWorkspace(workspace);
  if (!saveRes.success) {
    return { success: false, count: 0, message: saveRes.message };
  }

  // Open a clean blank tab before closing to keep the window alive
  await chrome.tabs.create({});
  if (tabIdsToClose.length > 0) {
    await chrome.tabs.remove(tabIdsToClose);
  }

  return { success: true, count: stashedItems.length };
}

// Runtime message handler
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'STASH_TABS') {
    (async () => {
      const res = await stashCurrentWindowTabs(message.name || 'Project Workspace');
      sendResponse(res);
    })();
    return true;
  }

  if (message.action === 'RESTORE_WORKSPACE') {
    (async () => {
      const tabs: TabItem[] = message.tabs || [];
      const createdIds: number[] = [];
      for (const t of tabs) {
        const created = await chrome.tabs.create({ url: t.url, active: false });
        if (created.id) createdIds.push(created.id);
      }

      // Group tabs if supported
      if (chrome.tabGroups && createdIds.length > 0) {
        try {
          const groupId = await (chrome.tabs as any).group({ tabIds: createdIds });
          await (chrome.tabGroups as any).update(groupId, {
            title: message.name || 'Restored Workspace',
            color: 'blue'
          });
        } catch (e) {
          // ignore tab group errors if not available
        }
      }

      sendResponse({ success: true });
    })();
    return true;
  }

  return true;
});
