import { OfficeMateSidebar } from './officemateSidebar';
import { initOutlookCopilot } from './outlookCopilot';
import sidebarCss from './officemateSidebar.css?raw';

let sidebarInstance: OfficeMateSidebar | null = null;

function initOfficeMate() {
  if (sidebarInstance) return;

  try {
    sidebarInstance = new OfficeMateSidebar(sidebarCss);
    sidebarInstance.init();
    initOutlookCopilot();
    console.log('⚡ OfficeMate initialized on page.');
  } catch (err) {
    console.error('Failed to initialize OfficeMate', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOfficeMate);
} else {
  initOfficeMate();
}

// Prevent Firefox menu bar intercepting Alt+Shift shortcuts
window.addEventListener(
  'keydown',
  (e: KeyboardEvent) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyC') {
      e.preventDefault();
    }
  },
  true // Capture phase
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'TOGGLE_SIDEBAR') {
    sidebarInstance?.toggleSidebar();
    sendResponse({ success: true });
    return true;
  }
  return true;
});
