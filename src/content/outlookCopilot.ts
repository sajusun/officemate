import { generateAIDraft } from '../lib/aiDrafts';
import { getSettings, canGenerateDraft, incrementDraftCount } from '../lib/storage';
import { EmailTone } from '../lib/types';

export function initOutlookCopilot(onDraftReady?: (text: string) => void) {
  const isOutlook = /outlook\.(office|live|office365)\.com/i.test(window.location.hostname);
  if (!isOutlook) return;

  // Poll or observe for compose box
  const observer = new MutationObserver(() => {
    injectOutlookToolbar(onDraftReady);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  injectOutlookToolbar(onDraftReady);
}

function injectOutlookToolbar(onDraftReady?: (text: string) => void) {
  // Outlook compose container
  const composeBoxes = document.querySelectorAll('[role="textbox"][contenteditable="true"], .elementToProof');

  composeBoxes.forEach((box) => {
    if (box.getAttribute('data-officemate-injected') === 'true') return;
    box.setAttribute('data-officemate-injected', 'true');

    const toolbar = document.createElement('div');
    toolbar.className = 'officemate-outlook-quickbar';
    toolbar.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #1e293b;
      border: 1px solid rgba(99, 102, 241, 0.4);
      border-radius: 6px;
      margin-bottom: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11.5px;
      color: #f8fafc;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    `;

    toolbar.innerHTML = `
      <span style="font-weight: 700; color: #818cf8; display: flex; align-items: center; gap: 4px;">
        ⚡ OfficeMate AI:
      </span>
      <button class="om-quick-tone" data-tone="polite_pushback" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Polite Pushback</button>
      <button class="om-quick-tone" data-tone="executive_status" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Status Update</button>
      <button class="om-quick-tone" data-tone="formal_confirmation" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Confirmation</button>
    `;

    box.parentElement?.insertBefore(toolbar, box);

    toolbar.querySelectorAll('.om-quick-tone').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const tone = (btn as HTMLElement).getAttribute('data-tone') as EmailTone;
        const { allowed } = await canGenerateDraft();
        if (!allowed) {
          let warn = toolbar.querySelector('.om-warn') as HTMLElement | null;
          if (!warn) {
            warn = document.createElement('div');
            warn.className = 'om-warn';
            warn.style.cssText = 'color: #f87171; font-size: 11px; margin-top: 4px; font-weight: 600; width: 100%;';
            toolbar.appendChild(warn);
          }
          warn.innerHTML = '⚠️ Daily free limit reached! <a href="#pro_key" target="_blank" style="color: #fbbf24; font-weight: 700; text-decoration: underline; margin-left: 4px;">Upgrade to Pro (#pro_key) ↗</a>';
          return;
        }

        const settings = await getSettings();
        // Grab thread subject or previous email text if available
        const threadText = document.querySelector('[role="main"]')?.textContent?.substring(0, 500) || '';
        const draft = await generateAIDraft(tone, { incomingText: threadText }, settings);
        await incrementDraftCount();

        // Insert into compose box
        (box as HTMLElement).focus();
        document.execCommand('insertText', false, draft);

        if (onDraftReady) onDraftReady(draft);
      });
    });
  });
}
