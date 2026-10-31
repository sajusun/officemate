import { generateAIDraft } from '../lib/aiDrafts';
import { extractActionItemsFromText } from './teamsGrabber';
import {
  getSettings,
  canGenerateDraft,
  incrementDraftCount,
  getWorkspaces,
  saveWorkspace,
  deleteWorkspace,
  getMeetingNotes,
  saveMeetingNote
} from '../lib/storage';
import { EmailTone, ProjectWorkspace, MeetingNote, ActionItem } from '../lib/types';

export class OfficeMateSidebar {
  private container: HTMLDivElement | null = null;
  private shadow: ShadowRoot | null = null;
  private isOpen: boolean = false;
  private currentTone: EmailTone = 'polite_pushback';
  private currentActionItems: ActionItem[] = [];

  constructor(private cssContent: string) {}

  public init() {
    if (document.getElementById('officemate-root')) return;

    this.container = document.createElement('div');
    this.container.id = 'officemate-root';
    this.shadow = this.container.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = this.cssContent;
    this.shadow.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.id = 'officemate-wrapper';
    this.shadow.appendChild(wrapper);

    document.body.appendChild(this.container);

    this.renderPill();
    this.renderSidebar();
    this.initShortcuts();
  }

  private showToast(msg: string) {
    if (!this.shadow) return;
    const toast = document.createElement('div');
    toast.className = 'om-toast';
    toast.textContent = msg;
    this.shadow.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  private renderPill() {
    if (!this.shadow) return;
    const wrapper = this.shadow.getElementById('officemate-wrapper');
    if (!wrapper) return;

    const pill = document.createElement('div');
    pill.className = 'officemate-pill';
    pill.id = 'officemate-launch-pill';
    pill.innerHTML = `
      <div class="pill-logo">OM</div>
      <span class="pill-text">OfficeMate</span>
      <span class="pill-badge">Copilot</span>
    `;

    pill.addEventListener('click', () => this.toggleSidebar());
    wrapper.appendChild(pill);
  }

  public async toggleSidebar() {
    if (!this.shadow) return;
    const sidebar = this.shadow.getElementById('officemate-main-sidebar');
    if (!sidebar) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      sidebar.classList.add('open');
      const settings = await getSettings();
      const proLink = this.shadow.getElementById('sidebar-pro-link') as HTMLAnchorElement | null;
      if (proLink) {
        if (settings.isPro) {
          proLink.textContent = '👑 PRO';
          proLink.style.color = '#a5b4fc';
          proLink.style.background = 'rgba(99,102,241,0.2)';
          proLink.style.borderColor = 'rgba(99,102,241,0.35)';
          proLink.removeAttribute('href');
        } else {
          proLink.textContent = '👑 Get Pro ↗';
          proLink.href = '#pro_key';
        }
      }
      this.refreshWorkspaces();
      this.refreshNotes();
    } else {
      sidebar.classList.remove('open');
    }
  }

  private renderSidebar() {
    if (!this.shadow) return;
    const wrapper = this.shadow.getElementById('officemate-wrapper');
    if (!wrapper) return;

    const sidebar = document.createElement('aside');
    sidebar.className = 'officemate-sidebar';
    sidebar.id = 'officemate-main-sidebar';

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-title-group">
          <div class="pill-logo" style="width: 22px; height: 22px; font-size: 10px;">OM</div>
          <span class="sidebar-title">OfficeMate Copilot</span>
          <a href="#pro_key" target="_blank" id="sidebar-pro-link" style="font-size: 10px; font-weight: 700; color: #fbbf24; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); padding: 2px 7px; border-radius: 4px; text-decoration: none; margin-left: 8px;">👑 Get Pro ↗</a>
        </div>
        <button class="close-btn" id="btn-close-sidebar">✕</button>
      </div>

      <nav class="sidebar-tabs">
        <button class="tab-btn active" data-tab="drafts">✉️ AI Drafts</button>
        <button class="tab-btn" data-tab="notes">📝 Meeting Notes</button>
        <button class="tab-btn" data-tab="workspace">🗂️ Workspaces</button>
      </nav>

      <div class="sidebar-body">
        <!-- Panel 1: AI Email Drafts -->
        <div class="panel active" id="panel-drafts">
          <span class="section-title">Select Professional Tone</span>
          <div class="tone-grid">
            <button class="tone-card active" data-tone="polite_pushback">🛡️ Polite Pushback</button>
            <button class="tone-card" data-tone="executive_status">📊 Status Update</button>
            <button class="tone-card" data-tone="formal_confirmation">🤝 Confirmation</button>
            <button class="tone-card" data-tone="friendly_followup">👋 Follow-Up</button>
            <button class="tone-card" data-tone="meeting_reschedule">📅 Reschedule</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label class="section-title">Incoming Email Context / Key Points</label>
            <textarea class="om-textarea" id="draft-context-input" rows="3" placeholder="Paste incoming email or write brief points..."></textarea>
          </div>

          <button class="om-btn primary" id="btn-generate-draft">
            <span>⚡ Generate Professional Draft</span>
          </button>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="section-title">Draft Preview</span>
              <button class="om-btn" id="btn-copy-draft" style="font-size: 11px; height: 26px;">📋 Copy</button>
            </div>
            <div class="draft-preview-box" id="draft-output-preview" contenteditable="true">
              Click 'Generate Professional Draft' above to produce your response.
            </div>
          </div>
        </div>

        <!-- Panel 2: Meeting Notes & Actions -->
        <div class="panel" id="panel-notes">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="section-title">Action Items & Takeaways</span>
            <button class="om-btn" id="btn-grab-actions" style="font-size: 11px;">📌 Grab from Selection</button>
          </div>

          <div id="action-items-list" style="display: flex; flex-direction: column; gap: 6px;">
            <div style="color: #64748b; font-size: 12px; font-style: italic;">
              Highlight chat text or meeting notes and click "Grab from Selection".
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
            <label class="section-title">Meeting Notes</label>
            <textarea class="om-textarea" id="meeting-notes-input" rows="5" placeholder="Key decisions, attendees, next steps..."></textarea>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="om-btn primary" id="btn-save-meeting-note" style="flex: 1;">Save Note</button>
            <button class="om-btn" id="btn-export-notes-md">Export .md</button>
          </div>

          <div id="saved-notes-history" style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;"></div>
        </div>

        <!-- Panel 3: Workspace Stash -->
        <div class="panel" id="panel-workspace">
          <div style="background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); border-radius: 8px; padding: 12px;">
            <strong style="color: #a5b4fc; font-size: 13px; display: block; margin-bottom: 4px;">Project Tab Stash</strong>
            <span style="font-size: 11.5px; color: #cbd5e1; line-height: 1.4;">
              Stash 15–30 open project tabs (Jira, Outlook, Confluence, GitHub) in 1 click to clear mental clutter & free RAM.
            </span>
          </div>

          <div style="display: flex; gap: 8px;">
            <input type="text" id="new-workspace-name" class="om-textarea" style="height: 36px; padding: 6px 12px;" placeholder="Workspace name (e.g. Client Alpha, Q3 Audit)">
            <button class="om-btn primary" id="btn-stash-current-tabs" style="white-space: nowrap;">⚡ Stash Tabs</button>
          </div>

          <span class="section-title">Saved Workspaces</span>
          <div id="workspaces-list" style="display: flex; flex-direction: column; gap: 10px;">
            <!-- Workspaces rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    wrapper.appendChild(sidebar);

    // Event Handlers
    sidebar.querySelector('#btn-close-sidebar')?.addEventListener('click', () => this.toggleSidebar());

    // Tabs
    sidebar.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sidebar.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        sidebar.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        sidebar.querySelector(`#panel-${tab}`)?.classList.add('active');
      });
    });

    // Tone selector
    sidebar.querySelectorAll('.tone-card').forEach((card) => {
      card.addEventListener('click', () => {
        sidebar.querySelectorAll('.tone-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        this.currentTone = card.getAttribute('data-tone') as EmailTone;
      });
    });

    // Generate Draft
    sidebar.querySelector('#btn-generate-draft')?.addEventListener('click', async () => {
      const { allowed } = await canGenerateDraft();
      if (!allowed) {
        this.showToast('Daily free draft limit (3) reached! Upgrade to Pro (#pro_key) for unlimited drafts.');
        return;
      }

      const input = (sidebar.querySelector('#draft-context-input') as HTMLTextAreaElement).value.trim();
      const output = sidebar.querySelector('#draft-output-preview') as HTMLDivElement;
      output.textContent = 'Crafting executive response...';

      const settings = await getSettings();
      const draft = await generateAIDraft(this.currentTone, { incomingText: input }, settings);
      output.textContent = draft;
      await incrementDraftCount();
      this.showToast('Professional draft generated!');
    });

    // Copy Draft
    sidebar.querySelector('#btn-copy-draft')?.addEventListener('click', () => {
      const text = sidebar.querySelector('#draft-output-preview')?.textContent || '';
      navigator.clipboard.writeText(text);
      this.showToast('Draft copied to clipboard!');
    });

    // Grab Actions from selection
    sidebar.querySelector('#btn-grab-actions')?.addEventListener('click', () => {
      const sel = window.getSelection()?.toString();
      if (!sel) {
        this.showToast('Please highlight text with your mouse first!');
        return;
      }
      const items = extractActionItemsFromText(sel);
      if (items.length === 0) {
        this.showToast('No specific action items found in selection.');
        return;
      }
      this.currentActionItems.push(...items);
      this.renderActionItemsList();
      this.showToast(`Extracted ${items.length} action item(s)!`);
    });

    // Save Meeting Note
    sidebar.querySelector('#btn-save-meeting-note')?.addEventListener('click', async () => {
      const notes = (sidebar.querySelector('#meeting-notes-input') as HTMLTextAreaElement).value.trim();
      if (!notes && this.currentActionItems.length === 0) return;

      const note: MeetingNote = {
        id: 'note_' + Date.now(),
        meetingTitle: document.title || 'Meeting Notes',
        date: new Date().toLocaleDateString(),
        notes,
        actionItems: this.currentActionItems,
        timestamp: Date.now()
      };

      await saveMeetingNote(note);
      (sidebar.querySelector('#meeting-notes-input') as HTMLTextAreaElement).value = '';
      this.currentActionItems = [];
      this.renderActionItemsList();
      this.refreshNotes();
      this.showToast('Meeting notes saved!');
    });

    // Export MD
    sidebar.querySelector('#btn-export-notes-md')?.addEventListener('click', async () => {
      const notes = await getMeetingNotes();
      if (notes.length === 0) {
        this.showToast('No meeting notes to export.');
        return;
      }

      const md = `# OfficeMate Meeting Notes\nGenerated: ${new Date().toLocaleString()}\n\n` +
        notes.map((n) => `## ${n.meetingTitle} (${n.date})\n${n.notes}\n\n### Action Items:\n` +
          n.actionItems.map((a) => `- [${a.completed ? 'x' : ' '}] ${a.text}`).join('\n')
        ).join('\n\n---\n\n');

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Meeting_Notes_${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showToast('Exported to Markdown (.md)!');
    });

    // Stash Current Tabs
    sidebar.querySelector('#btn-stash-current-tabs')?.addEventListener('click', () => {
      const nameInput = sidebar.querySelector('#new-workspace-name') as HTMLInputElement;
      const name = nameInput.value.trim() || `Workspace ${new Date().toLocaleDateString()}`;

      chrome.runtime.sendMessage({ action: 'STASH_TABS', name }, (res) => {
        if (res?.success) {
          nameInput.value = '';
          this.refreshWorkspaces();
          this.showToast(`Stashed ${res.count} tabs into "${name}"!`);
        } else {
          this.showToast(res?.message || 'Failed to stash workspace.');
        }
      });
    });
  }

  private renderActionItemsList() {
    if (!this.shadow) return;
    const container = this.shadow.getElementById('action-items-list');
    if (!container) return;

    if (this.currentActionItems.length === 0) {
      container.innerHTML = `<div style="color: #64748b; font-size: 12px; font-style: italic;">No active action items. Highlight text above to add!</div>`;
      return;
    }

    container.innerHTML = this.currentActionItems.map((item, idx) => `
      <div style="display: flex; align-items: center; gap: 8px; background: #1e293b; padding: 6px 10px; border-radius: 6px; font-size: 12px;">
        <input type="checkbox" class="act-check" ${item.completed ? 'checked' : ''} data-idx="${idx}">
        <span style="flex: 1; ${item.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${item.text}</span>
        <button class="close-btn act-del" data-idx="${idx}" style="font-size: 12px; color: #ef4444;">✕</button>
      </div>
    `).join('');

    container.querySelectorAll('.act-check').forEach((chk) => {
      chk.addEventListener('change', (e) => {
        const idx = Number((chk as HTMLElement).getAttribute('data-idx'));
        this.currentActionItems[idx].completed = (e.target as HTMLInputElement).checked;
        this.renderActionItemsList();
      });
    });

    container.querySelectorAll('.act-del').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number((btn as HTMLElement).getAttribute('data-idx'));
        this.currentActionItems.splice(idx, 1);
        this.renderActionItemsList();
      });
    });
  }

  private async refreshWorkspaces() {
    if (!this.shadow) return;
    const container = this.shadow.getElementById('workspaces-list');
    if (!container) return;

    const workspaces = await getWorkspaces();
    if (workspaces.length === 0) {
      container.innerHTML = `<div style="color: #64748b; font-size: 12px; text-align: center; padding: 20px 0;">No stashed workspaces yet. Type a name and click "Stash Tabs".</div>`;
      return;
    }

    container.innerHTML = workspaces.map((ws) => `
      <div class="workspace-card" data-ws-id="${ws.id}">
        <div class="ws-header">
          <div class="ws-title">
            <span class="ws-color-dot" style="background: ${ws.color || '#38bdf8'};"></span>
            <span>${ws.name}</span>
          </div>
          <span class="ws-tabs-count">${ws.tabs.length} tabs</span>
        </div>
        <div class="ws-actions">
          <button class="om-btn primary btn-restore-ws" style="flex: 1; height: 28px; font-size: 11px;">🚀 Restore Workspace</button>
          <button class="om-btn btn-del-ws" style="height: 28px; font-size: 11px; color: #ef4444;">✕</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-restore-ws').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const card = (e.target as HTMLElement).closest('.workspace-card');
        const id = card?.getAttribute('data-ws-id');
        const ws = workspaces.find((w) => w.id === id);
        if (ws) {
          chrome.runtime.sendMessage({ action: 'RESTORE_WORKSPACE', tabs: ws.tabs });
          this.showToast(`Restoring ${ws.tabs.length} tabs!`);
        }
      });
    });

    container.querySelectorAll('.btn-del-ws').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const card = (e.target as HTMLElement).closest('.workspace-card');
        const id = card?.getAttribute('data-ws-id');
        if (id) {
          await deleteWorkspace(id);
          this.refreshWorkspaces();
          this.showToast('Workspace deleted.');
        }
      });
    });
  }

  private async refreshNotes() {
    if (!this.shadow) return;
    const container = this.shadow.getElementById('saved-notes-history');
    if (!container) return;

    const notes = await getMeetingNotes();
    if (notes.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = notes.slice(0, 5).map((n) => `
      <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 8px 10px; font-size: 12px;">
        <strong style="color: #f8fafc; display: block;">${n.meetingTitle}</strong>
        <span style="color: #64748b; font-size: 10px;">${n.date} • ${n.actionItems.length} action items</span>
      </div>
    `).join('');
  }

  private initShortcuts() {
    const handleKey = (e: KeyboardEvent) => {
      // Robust physical key detection using e.code
      const isKeyC = e.code === 'KeyC' || e.key.toLowerCase() === 'c';
      const isKeyO = e.code === 'KeyO' || e.key.toLowerCase() === 'o';

      // Support Alt + Shift + C, Alt + Shift + O, or Ctrl + Shift + C
      const isAltShift = e.altKey && e.shiftKey && (isKeyC || isKeyO);
      const isCtrlShift = e.ctrlKey && e.shiftKey && isKeyC;

      if (isAltShift || isCtrlShift) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKey, { capture: true });
    document.addEventListener('keydown', handleKey, { capture: true });
  }
}
