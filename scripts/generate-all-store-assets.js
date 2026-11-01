import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.resolve(rootDir, 'public/store-assets');
const artifactsDir = 'C:/Users/Dell/.gemini/antigravity/brain/a7a1c9b0-1c53-4d79-b5ca-55d44ae9ba88';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function renderSvg(svgStr, width, height, filename) {
  const resvg = new Resvg(svgStr, {
    fitTo: { mode: 'width', value: width }
  });
  const pngData = resvg.render().asPng();
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, pngData);
  console.log(`✅ Generated: ${filename} (${width}x${height})`);

  // Copy to artifacts
  try {
    fs.copyFileSync(filePath, path.join(artifactsDir, `officemate-${filename}`));
  } catch (e) {
    // ignore
  }
}

// ============================================================================
// 1. SMALL PROMOTIONAL TILE (EXACTLY 440 x 280)
// ============================================================================
const svgSmall = `
<svg width="440" height="280" viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgSmall" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1128" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>

    <linearGradient id="azureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0078d4" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="440" height="280" fill="url(#bgSmall)" />
  <rect x="2" y="2" width="436" height="276" fill="none" stroke="rgba(0,120,212,0.25)" stroke-width="2" rx="12" />

  <!-- Ambient Light -->
  <circle cx="380" cy="50" r="100" fill="#0078d4" opacity="0.25" filter="url(#softGlow)" />
  <circle cx="60" cy="220" r="90" fill="#6366f1" opacity="0.2" filter="url(#softGlow)" />

  <!-- Top Logo & Brand -->
  <g transform="translate(24, 24)">
    <rect width="40" height="40" rx="10" fill="url(#azureGrad)" />
    <!-- Envelope Icon -->
    <path d="M 10 14 L 20 22 L 30 14" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="8" y="12" width="24" height="16" rx="2" fill="none" stroke="#ffffff" stroke-width="2" />

    <text x="52" y="22" font-family="'Segoe UI', -apple-system, Roboto, sans-serif" font-weight="900" font-size="20" fill="#ffffff">OfficeMate</text>
    <text x="156" y="22" font-family="'Segoe UI', -apple-system, Roboto, sans-serif" font-weight="700" font-size="14" fill="#38bdf8">Copilot</text>
    <text x="52" y="38" font-family="'Segoe UI', -apple-system, Roboto, sans-serif" font-weight="600" font-size="11" fill="#94a3b8">Executive Assistant for Microsoft 365</text>
  </g>

  <!-- Center Headline -->
  <text x="24" y="112" font-family="'Segoe UI', -apple-system, Roboto, sans-serif" font-weight="900" font-size="22" fill="#ffffff">
    Outlook AI Replies &amp; Tab Stash
  </text>
  <text x="24" y="136" font-family="'Segoe UI', -apple-system, Roboto, sans-serif" font-weight="500" font-size="13" fill="#cbd5e1">
    1-Click executive drafts, Teams notes &amp; RAM saver.
  </text>

  <!-- Feature Pills -->
  <g transform="translate(24, 164)">
    <rect width="118" height="32" rx="8" fill="rgba(0,120,212,0.18)" stroke="rgba(56,189,248,0.4)" stroke-width="1.2" />
    <text x="59" y="21" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#38bdf8" text-anchor="middle">✉️ Smart Replies</text>

    <rect x="126" width="116" height="32" rx="8" fill="rgba(99,102,241,0.18)" stroke="rgba(129,140,248,0.4)" stroke-width="1.2" />
    <text x="184" y="21" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#a5b4fc" text-anchor="middle">🗂️ Tab Stashing</text>

    <rect x="250" width="142" height="32" rx="8" fill="rgba(16,185,129,0.18)" stroke="rgba(52,211,153,0.4)" stroke-width="1.2" />
    <text x="321" y="21" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#34d399" text-anchor="middle">📝 Teams Actions</text>
  </g>

  <!-- Bottom Privacy Pill -->
  <g transform="translate(24, 222)">
    <rect width="392" height="34" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="196" y="22" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#94a3b8" text-anchor="middle">
      🔒 100% Client-Side Privacy • Zero Telemetry • Exclusively for Edge
    </text>
  </g>
</svg>
`;

// ============================================================================
// 2. LARGE PROMOTIONAL TILE (EXACTLY 1400 x 560)
// ============================================================================
const svgMarquee = `
<svg width="1400" height="560" viewBox="0 0 1400 560" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgMarquee" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080e1f" />
      <stop offset="45%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>

    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0078d4" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>

    <linearGradient id="cardGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <filter id="bigGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="35" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="cardShadowM" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect width="1400" height="560" fill="url(#bgMarquee)" />

  <!-- Ambient Lights -->
  <circle cx="250" cy="180" r="240" fill="#0078d4" opacity="0.18" filter="url(#bigGlow)" />
  <circle cx="1150" cy="380" r="220" fill="#6366f1" opacity="0.22" filter="url(#bigGlow)" />

  <!-- LEFT COLUMN: Value Proposition -->
  <g transform="translate(100, 70)">
    <!-- Top Pill -->
    <rect width="250" height="36" rx="18" fill="rgba(0,120,212,0.15)" stroke="#38bdf8" stroke-width="1.5" />
    <text x="125" y="23" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#38bdf8" text-anchor="middle">💼 EXECUTIVE COPILOT FOR EDGE</text>

    <!-- Main Title -->
    <text x="0" y="110" font-family="'Segoe UI', -apple-system, sans-serif" font-weight="900" font-size="56" fill="#ffffff">
      OfficeMate <tspan fill="url(#accentGrad)">for Edge</tspan>
    </text>

    <!-- Subtitle -->
    <text x="0" y="156" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="22" fill="#cbd5e1">
      1-Click Outlook Email Drafts &amp; Workspace Tab Stash
    </text>

    <text x="0" y="190" font-family="'Segoe UI', sans-serif" font-weight="400" font-size="16" fill="#94a3b8">
      Reclaim 10+ hours every week from repetitive emails and cluttered browser tabs.
    </text>

    <!-- Bullets -->
    <g transform="translate(0, 230)">
      <circle cx="14" cy="14" r="14" fill="#0078d4" opacity="0.25" />
      <text x="14" y="19" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="15" fill="#38bdf8" text-anchor="middle">✓</text>
      <text x="40" y="20" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="17" fill="#ffffff">Smart Replies in Outlook Web (Polite Pushback, Status Updates)</text>

      <circle cx="14" cy="56" r="14" fill="#6366f1" opacity="0.25" />
      <text x="14" y="61" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="15" fill="#a5b4fc" text-anchor="middle">✓</text>
      <text x="40" y="62" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="17" fill="#ffffff">Project Tab Stasher (Ctrl+Shift+U) to save 50% system RAM</text>

      <circle cx="14" cy="98" r="14" fill="#10b981" opacity="0.25" />
      <text x="14" y="103" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="15" fill="#34d399" text-anchor="middle">✓</text>
      <text x="40" y="104" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="17" fill="#ffffff">Distill messy Teams meeting chats into action-item checklists</text>
    </g>

    <!-- Bottom Security Badges -->
    <g transform="translate(0, 390)">
      <rect width="180" height="42" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
      <text x="90" y="27" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="#e2e8f0" text-anchor="middle">🔒 100% Client-Side</text>

      <rect x="195" width="200" height="42" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
      <text x="295" y="27" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="#e2e8f0" text-anchor="middle">⚡ Zero Server Telemetry</text>

      <rect x="410" width="180" height="42" rx="10" fill="url(#accentGrad)" />
      <text x="500" y="27" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#080e1f" text-anchor="middle">👑 PRO LIFETIME</text>
    </g>
  </g>

  <!-- RIGHT COLUMN: 3D UI Window Showcase -->
  <g transform="translate(850, 75)" filter="url(#cardShadowM)">
    <!-- Outlook Window Frame -->
    <rect width="450" height="410" rx="18" fill="url(#cardGradM)" stroke="#334155" stroke-width="2" />

    <!-- Window Top Header Bar -->
    <rect width="450" height="44" rx="18" fill="#111c33" />
    <circle cx="24" cy="22" r="6" fill="#ef4444" />
    <circle cx="42" cy="22" r="6" fill="#f59e0b" />
    <circle cx="60" cy="22" r="6" fill="#10b981" />
    <text x="225" y="27" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" text-anchor="middle">Outlook Web • Smart Reply</text>

    <!-- Floating Tone Selector -->
    <g transform="translate(25, 65)">
      <rect width="180" height="32" rx="8" fill="#0078d4" />
      <text x="90" y="21" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#ffffff" text-anchor="middle">⚡ Polite Pushback</text>

      <rect x="190" width="180" height="32" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
      <text x="280" y="21" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#94a3b8" text-anchor="middle">Executive Status</text>
    </g>

    <!-- Email Drafting Box -->
    <g transform="translate(25, 115)">
      <rect width="400" height="200" rx="12" fill="#090d16" stroke="#1e293b" stroke-width="1" />
      <text x="20" y="35" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#38bdf8">Subject: Re: Revised Q4 Project Deliverables</text>
      <line x1="20" y1="48" x2="380" y2="48" stroke="#1e293b" stroke-width="1" />

      <text x="20" y="75" font-family="'Segoe UI', sans-serif" font-size="12" fill="#cbd5e1">Hi Team,</text>
      <text x="20" y="100" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">Thank you for sharing the updated roadmap.</text>
      <text x="20" y="125" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">To maintain code quality, we will align on Phase 1 first.</text>
      <text x="20" y="150" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">Deliverables remain on schedule for Friday review.</text>
      <text x="20" y="180" font-family="'Segoe UI', sans-serif" font-size="12" fill="#38bdf8">Best regards, Senior Engineering Lead</text>
    </g>

    <!-- Bottom Action Button -->
    <g transform="translate(25, 335)">
      <rect width="400" height="48" rx="10" fill="url(#accentGrad)" />
      <text x="200" y="30" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="15" fill="#080e1f" text-anchor="middle">⚡ Insert Generated Draft into Outlook</text>
    </g>
  </g>
</svg>
`;

// ============================================================================
// 3. SCREENSHOT 1: OUTLOOK AI SMART REPLIES (EXACTLY 1280 x 800)
// ============================================================================
const svgShot1 = `
<svg width="1280" height="800" viewBox="0 0 1280 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgShot1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070c18" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <linearGradient id="blueG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0078d4" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <filter id="shadowS1" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect width="1280" height="800" fill="url(#bgShot1)" />

  <!-- TOP HEADER / BADGE OVERLAY -->
  <g transform="translate(80, 45)">
    <rect width="210" height="34" rx="17" fill="rgba(0,120,212,0.15)" stroke="#38bdf8" stroke-width="1.5" />
    <text x="105" y="22" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#38bdf8" text-anchor="middle">OUTLOOK WEB INTEGRATION</text>

    <text x="0" y="80" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="34" fill="#ffffff">
      1-Click Executive Outlook Email Replies
    </text>
    <text x="0" y="112" font-family="'Segoe UI', sans-serif" font-weight="500" font-size="16" fill="#94a3b8">
      Never type repetitive emails from scratch. Select from curated corporate tones or customize sign-offs.
    </text>
  </g>

  <!-- MOCKUP BROWSER WINDOW -->
  <g transform="translate(80, 185)" filter="url(#shadowS1)">
    <!-- Window Frame -->
    <rect width="1120" height="560" rx="16" fill="#111827" stroke="#374151" stroke-width="2" />
    
    <!-- Titlebar -->
    <rect width="1120" height="48" rx="16" fill="#1f2937" />
    <circle cx="28" cy="24" r="6" fill="#ef4444" />
    <circle cx="48" cy="24" r="6" fill="#f59e0b" />
    <circle cx="68" cy="24" r="6" fill="#10b981" />
    <rect x="220" y="10" width="680" height="28" rx="6" fill="#111827" />
    <text x="560" y="28" font-family="'Segoe UI', sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">https://outlook.live.com/mail/0/inbox</text>

    <!-- Window Body: Left Mail List -->
    <rect x="0" y="48" width="300" height="512" fill="#1e293b" />
    <text x="24" y="85" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="16" fill="#ffffff">Inbox (14)</text>

    <!-- Mail Items -->
    <rect x="12" y="105" width="276" height="74" rx="8" fill="#0f172a" stroke="#0078d4" stroke-width="2" />
    <text x="26" y="130" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#ffffff">Sarah Jenkins (VP Product)</text>
    <text x="26" y="150" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#38bdf8">Urgent: Scope review for Sprint 42</text>
    <text x="26" y="166" font-family="'Segoe UI', sans-serif" font-size="11" fill="#64748b">Please see the updated requirements...</text>

    <rect x="12" y="188" width="276" height="74" rx="8" fill="#1e293b" />
    <text x="26" y="213" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#cbd5e1">Finance Operations</text>
    <text x="26" y="233" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">Q4 Budget Alignment Call</text>

    <rect x="12" y="271" width="276" height="74" rx="8" fill="#1e293b" />
    <text x="26" y="296" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#cbd5e1">David Chen</text>
    <text x="26" y="316" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">API Architecture Signoff</text>

    <!-- Reading Pane -->
    <rect x="300" y="48" width="820" height="512" fill="#0f172a" />
    
    <!-- Active Email Details -->
    <text x="340" y="95" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="20" fill="#ffffff">Urgent: Scope review for Sprint 42</text>
    <text x="340" y="122" font-family="'Segoe UI', sans-serif" font-size="13" fill="#94a3b8">From: Sarah Jenkins &lt;s.jenkins@corp.com&gt; • Today, 10:14 AM</text>
    
    <text x="340" y="160" font-family="'Segoe UI', sans-serif" font-size="14" fill="#cbd5e1">Hi Team,</text>
    <text x="340" y="185" font-family="'Segoe UI', sans-serif" font-size="14" fill="#cbd5e1">We need to add three more enterprise telemetry dashboards to Sprint 42.</text>
    <text x="340" y="210" font-family="'Segoe UI', sans-serif" font-size="14" fill="#cbd5e1">Can your engineering team commit to shipping this by Friday?</text>

    <!-- FLOATING OFFICEMATE COPILOT BOX -->
    <g transform="translate(340, 245)">
      <rect width="740" height="270" rx="14" fill="#111e38" stroke="#0078d4" stroke-width="2" />
      
      <!-- Top Bar of Copilot -->
      <g transform="translate(24, 20)">
        <rect width="30" height="30" rx="6" fill="#0078d4" />
        <text x="15" y="20" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">⚡</text>
        <text x="40" y="21" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#ffffff">OfficeMate Copilot Tone Selector</text>

        <!-- Tones -->
        <rect x="290" width="130" height="28" rx="6" fill="#0078d4" />
        <text x="355" y="18" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="11" fill="#ffffff" text-anchor="middle">✓ Polite Pushback</text>

        <rect x="428" width="120" height="28" rx="6" fill="#1e293b" />
        <text x="488" y="18" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="#94a3b8" text-anchor="middle">Executive Status</text>

        <rect x="556" width="125" height="28" rx="6" fill="#1e293b" />
        <text x="618" y="18" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="#94a3b8" text-anchor="middle">Reschedule Meeting</text>
      </g>

      <!-- Generated Reply Preview -->
      <rect x="24" y="65" width="692" height="135" rx="8" fill="#090e1b" stroke="#1e293b" stroke-width="1" />
      <text x="44" y="95" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">Hi Sarah,</text>
      <text x="44" y="120" font-family="'Segoe UI', sans-serif" font-size="13" fill="#94a3b8">Thank you for sharing the additional requirements. To protect system stability and existing sprint commitments,</text>
      <text x="44" y="142" font-family="'Segoe UI', sans-serif" font-size="13" fill="#94a3b8">we recommend prioritizing the core data pipeline first and slotting the dashboards into Sprint 43.</text>
      <text x="44" y="172" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="#38bdf8">Best regards, Senior Engineering Lead</text>

      <!-- Action Button -->
      <g transform="translate(24, 212)">
        <rect width="692" height="42" rx="8" fill="url(#blueG)" />
        <text x="346" y="26" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#070c18" text-anchor="middle">
          ⚡ 1-Click Insert Reply into Outlook Composer
        </text>
      </g>
    </g>
  </g>
</svg>
`;

// ============================================================================
// 4. SCREENSHOT 2: WORKSPACE TAB STASHER (EXACTLY 1280 x 800)
// ============================================================================
const svgShot2 = `
<svg width="1280" height="800" viewBox="0 0 1280 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgShot2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070c18" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <linearGradient id="purpleG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>

    <filter id="shadowS2" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect width="1280" height="800" fill="url(#bgShot2)" />

  <!-- TOP HEADER -->
  <g transform="translate(80, 45)">
    <rect width="210" height="34" rx="17" fill="rgba(99,102,241,0.15)" stroke="#a5b4fc" stroke-width="1.5" />
    <text x="105" y="22" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#a5b4fc" text-anchor="middle">TAB &amp; RAM OPTIMIZER</text>

    <text x="0" y="80" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="34" fill="#ffffff">
      Project Workspace Tab Stasher (Ctrl + Shift + U)
    </text>
    <text x="0" y="112" font-family="'Segoe UI', sans-serif" font-weight="500" font-size="16" fill="#94a3b8">
      Stash 30+ messy browser tabs into organized client workspaces. Free 50% system RAM and restore sessions in 1 click.
    </text>
  </g>

  <!-- MOCKUP BROWSER WINDOW -->
  <g transform="translate(80, 185)" filter="url(#shadowS2)">
    <rect width="1120" height="560" rx="16" fill="#111827" stroke="#374151" stroke-width="2" />
    
    <!-- Titlebar with many tabs -->
    <rect width="1120" height="48" rx="16" fill="#1f2937" />
    <circle cx="28" cy="24" r="6" fill="#ef4444" />
    <circle cx="48" cy="24" r="6" fill="#f59e0b" />
    <circle cx="68" cy="24" r="6" fill="#10b981" />
    
    <!-- Cluttered Tabs -->
    <rect x="95" y="10" width="140" height="28" rx="5" fill="#374151" />
    <text x="165" y="28" font-family="'Segoe UI', sans-serif" font-size="11" fill="#ffffff" text-anchor="middle">Jira Sprint Board</text>

    <rect x="242" y="10" width="140" height="28" rx="5" fill="#374151" />
    <text x="312" y="28" font-family="'Segoe UI', sans-serif" font-size="11" fill="#ffffff" text-anchor="middle">AWS Console EC2</text>

    <rect x="389" y="10" width="140" height="28" rx="5" fill="#374151" />
    <text x="459" y="28" font-family="'Segoe UI', sans-serif" font-size="11" fill="#ffffff" text-anchor="middle">Figma Design System</text>

    <rect x="536" y="10" width="140" height="28" rx="5" fill="#0078d4" />
    <text x="606" y="28" font-family="'Segoe UI', sans-serif" font-size="11" fill="#ffffff" text-anchor="middle">OfficeMate Workspace</text>

    <!-- Workspace Sidebar Panel Inside Page -->
    <rect x="0" y="48" width="1120" height="512" fill="#0f172a" />

    <!-- Center Workspace Card Showcase -->
    <g transform="translate(60, 80)">
      <text x="0" y="25" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="22" fill="#ffffff">Saved Project Workspaces</text>
      <text x="0" y="48" font-family="'Segoe UI', sans-serif" font-size="13" fill="#94a3b8">Instant context switching between client proposals, code reviews, and meetings.</text>

      <!-- Workspace 1 -->
      <g transform="translate(0, 70)">
        <rect width="480" height="150" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <rect x="20" y="20" width="36" height="36" rx="8" fill="#0078d4" />
        <text x="38" y="43" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">📊</text>

        <text x="68" y="38" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="16" fill="#ffffff">Q4 Financial Review &amp; Deck</text>
        <text x="68" y="58" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">14 Tabs stashed • Saved 820MB RAM</text>

        <text x="24" y="96" font-family="'Segoe UI', sans-serif" font-size="12" fill="#cbd5e1">• Excel Online (Q4 Projections.xlsx)</text>
        <text x="24" y="118" font-family="'Segoe UI', sans-serif" font-size="12" fill="#cbd5e1">• PowerBI Executive Summary</text>

        <rect x="330" y="20" width="130" height="36" rx="8" fill="#0078d4" />
        <text x="395" y="43" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#ffffff" text-anchor="middle">⚡ Restore All (14)</text>
      </g>

      <!-- Workspace 2 -->
      <g transform="translate(520, 70)">
        <rect width="480" height="150" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <rect x="20" y="20" width="36" height="36" rx="8" fill="#10b981" />
        <text x="38" y="43" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">🚀</text>

        <text x="68" y="38" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="16" fill="#ffffff">Cloud Migration Sprint 42</text>
        <text x="68" y="58" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">9 Tabs stashed • Saved 640MB RAM</text>

        <text x="24" y="96" font-family="'Segoe UI', sans-serif" font-size="12" fill="#cbd5e1">• GitHub Pull Requests #182, #184</text>
        <text x="24" y="118" font-family="'Segoe UI', sans-serif" font-size="12" fill="#cbd5e1">• Datadog Cluster Monitor</text>

        <rect x="330" y="20" width="130" height="36" rx="8" fill="#10b981" />
        <text x="395" y="43" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#ffffff" text-anchor="middle">⚡ Restore All (9)</text>
      </g>

      <!-- Big Stash Button -->
      <g transform="translate(0, 245)">
        <rect width="1000" height="54" rx="12" fill="url(#purpleG)" />
        <text x="500" y="33" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">
          🗂️ Stash All Current Window Tabs into New Project Workspace (Ctrl + Shift + U)
        </text>
      </g>
    </g>
  </g>
</svg>
`;

// ============================================================================
// 5. SCREENSHOT 3: TEAMS MEETING ACTION-ITEM EXTRACTOR (EXACTLY 1280 x 800)
// ============================================================================
const svgShot3 = `
<svg width="1280" height="800" viewBox="0 0 1280 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgShot3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070c18" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <linearGradient id="emeraldG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <filter id="shadowS3" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect width="1280" height="800" fill="url(#bgShot3)" />

  <!-- TOP HEADER -->
  <g transform="translate(80, 45)">
    <rect width="210" height="34" rx="17" fill="rgba(16,185,129,0.15)" stroke="#34d399" stroke-width="1.5" />
    <text x="105" y="22" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#34d399" text-anchor="middle">MEETING SUMMARIZER</text>

    <text x="0" y="80" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="34" fill="#ffffff">
      Teams Meeting Notes &amp; Action-Item Extractor
    </text>
    <text x="0" y="112" font-family="'Segoe UI', sans-serif" font-weight="500" font-size="16" fill="#94a3b8">
      Distill long messy Teams chats and meeting notes into clear deliverables with owners and deadlines in seconds.
    </text>
  </g>

  <!-- MOCKUP WINDOW -->
  <g transform="translate(80, 185)" filter="url(#shadowS3)">
    <rect width="1120" height="560" rx="16" fill="#111827" stroke="#374151" stroke-width="2" />
    
    <!-- Titlebar -->
    <rect width="1120" height="48" rx="16" fill="#1f2937" />
    <circle cx="28" cy="24" r="6" fill="#ef4444" />
    <circle cx="48" cy="24" r="6" fill="#f59e0b" />
    <circle cx="68" cy="24" r="6" fill="#10b981" />
    <text x="560" y="28" font-family="'Segoe UI', sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">Microsoft Teams • Project Sync Chat</text>

    <rect x="0" y="48" width="1120" height="512" fill="#0f172a" />

    <!-- Left: Raw Meeting Chat -->
    <g transform="translate(40, 80)">
      <text x="0" y="20" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="16" fill="#ffffff">Raw Meeting Chat Transcript</text>

      <rect y="40" width="480" height="380" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1" />
      
      <text x="20" y="75" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#38bdf8">Alex (PM):</text>
      <text x="20" y="98" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">We need to finalize the vendor contract by Wednesday.</text>
      <text x="20" y="120" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">Marcus, can legal review the indemnity section?</text>

      <text x="20" y="165" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#a855f7">Marcus (Legal):</text>
      <text x="20" y="188" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">Yes, I will return redlines by Tuesday 3 PM.</text>

      <text x="20" y="235" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#34d399">Elena (Dev):</text>
      <text x="20" y="258" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">QA testing starts Thursday. Let's make sure the staging</text>
      <text x="20" y="280" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">environment has the latest database migration.</text>

      <rect x="20" y="320" width="440" height="42" rx="8" fill="#0078d4" />
      <text x="240" y="347" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#ffffff" text-anchor="middle">⚡ Distill into Action Checklist</text>
    </g>

    <!-- Right: Extracted Action Checklist -->
    <g transform="translate(560, 80)">
      <text x="0" y="20" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="16" fill="#34d399">Extracted Action Items (OfficeMate)</text>

      <rect y="40" width="520" height="380" rx="12" fill="#111c33" stroke="#10b981" stroke-width="2" />

      <!-- Item 1 -->
      <g transform="translate(24, 70)">
        <rect width="24" height="24" rx="6" fill="#10b981" />
        <text x="12" y="17" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">✓</text>
        <text x="36" y="17" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="#ffffff">Legal Indemnity Redline Review</text>
        <rect x="360" width="110" height="24" rx="12" fill="rgba(16,185,129,0.2)" />
        <text x="415" y="16" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#34d399" text-anchor="middle">Owner: Marcus</text>
        <text x="36" y="38" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">Deadline: Tuesday 3:00 PM</text>
      </g>

      <!-- Item 2 -->
      <g transform="translate(24, 150)">
        <rect width="24" height="24" rx="6" fill="#10b981" />
        <text x="12" y="17" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">✓</text>
        <text x="36" y="17" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="#ffffff">Staging DB Migration Deploy</text>
        <rect x="360" width="110" height="24" rx="12" fill="rgba(56,189,248,0.2)" />
        <text x="415" y="16" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#38bdf8" text-anchor="middle">Owner: Elena</text>
        <text x="36" y="38" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">Deadline: Wednesday EOD</text>
      </g>

      <!-- Item 3 -->
      <g transform="translate(24, 230)">
        <rect width="24" height="24" rx="6" fill="#10b981" />
        <text x="12" y="17" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">✓</text>
        <text x="36" y="17" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="#ffffff">Final Vendor Contract Execution</text>
        <rect x="360" width="110" height="24" rx="12" fill="rgba(245,158,11,0.2)" />
        <text x="415" y="16" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#fbbf24" text-anchor="middle">Owner: Alex</text>
        <text x="36" y="38" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8">Deadline: Wednesday 5:00 PM</text>
      </g>

      <!-- Copy Checklist Button -->
      <g transform="translate(24, 320)">
        <rect width="472" height="42" rx="8" fill="url(#emeraldG)" />
        <text x="236" y="26" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#070c18" text-anchor="middle">
          📋 1-Click Copy Checklist to Microsoft To-Do / Email
        </text>
      </g>
    </g>
  </g>
</svg>
`;

// ============================================================================
// 6. SCREENSHOT 4: FLOATING COPILOT SIDEBAR (EXACTLY 1280 x 800)
// ============================================================================
const svgShot4 = `
<svg width="1280" height="800" viewBox="0 0 1280 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgShot4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070c18" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <filter id="shadowS4" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect width="1280" height="800" fill="url(#bgShot4)" />

  <!-- TOP HEADER -->
  <g transform="translate(80, 45)">
    <rect width="210" height="34" rx="17" fill="rgba(245,158,11,0.15)" stroke="#fbbf24" stroke-width="1.5" />
    <text x="105" y="22" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#fbbf24" text-anchor="middle">SEAMLESS INTEGRATION</text>

    <text x="0" y="80" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="34" fill="#ffffff">
      Floating Copilot Sidebar (Alt + Shift + C)
    </text>
    <text x="0" y="112" font-family="'Segoe UI', sans-serif" font-weight="500" font-size="16" fill="#94a3b8">
      Access draft copilots, workspace stashing, and custom executive signatures on any web page without switching windows.
    </text>
  </g>

  <!-- MOCKUP WINDOW -->
  <g transform="translate(80, 185)" filter="url(#shadowS4)">
    <rect width="1120" height="560" rx="16" fill="#111827" stroke="#374151" stroke-width="2" />
    
    <!-- Titlebar -->
    <rect width="1120" height="48" rx="16" fill="#1f2937" />
    <circle cx="28" cy="24" r="6" fill="#ef4444" />
    <circle cx="48" cy="24" r="6" fill="#f59e0b" />
    <circle cx="68" cy="24" r="6" fill="#10b981" />
    <text x="560" y="28" font-family="'Segoe UI', sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">Microsoft 365 Portal • Cloud Workspace</text>

    <!-- Main Web Page Background -->
    <rect x="0" y="48" width="760" height="512" fill="#0f172a" />
    
    <text x="50" y="100" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="22" fill="#ffffff">Microsoft 365 Executive Dashboard</text>
    <rect x="50" y="130" width="300" height="150" rx="10" fill="#1e293b" />
    <text x="75" y="170" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="15" fill="#38bdf8">Weekly Briefing</text>
    <text x="75" y="200" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">3 Pending client proposals</text>
    <text x="75" y="225" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">2 Teams action checklists</text>

    <rect x="380" y="130" width="330" height="150" rx="10" fill="#1e293b" />
    <text x="405" y="170" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="15" fill="#10b981">RAM Optimization</text>
    <text x="405" y="200" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">23 Tabs Stashed (1.4 GB Saved)</text>
    <text x="405" y="225" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">Status: High Performance</text>

    <!-- RIGHT FLOATING COPILOT SIDEBAR -->
    <rect x="760" y="48" width="360" height="512" fill="#111c33" stroke="#0078d4" stroke-width="2" />
    
    <g transform="translate(784, 75)">
      <rect width="36" height="36" rx="8" fill="#0078d4" />
      <text x="18" y="24" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">💼</text>
      <text x="48" y="24" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="18" fill="#ffffff">OfficeMate Copilot</text>
      <text x="48" y="40" font-family="'Segoe UI', sans-serif" font-size="11" fill="#38bdf8">Sidebar Activated (Alt+Shift+C)</text>

      <!-- Signature Settings Box -->
      <g transform="translate(0, 60)">
        <rect width="312" height="150" rx="10" fill="#090e1b" stroke="#1e293b" stroke-width="1" />
        <text x="16" y="26" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#ffffff">Executive Signature Preset</text>

        <text x="16" y="55" font-family="'Segoe UI', sans-serif" font-size="11" fill="#94a3b8">Sender Name: Sakhawat Hossain</text>
        <text x="16" y="78" font-family="'Segoe UI', sans-serif" font-size="11" fill="#94a3b8">Title: Senior Technical Lead</text>
        <text x="16" y="101" font-family="'Segoe UI', sans-serif" font-size="11" fill="#94a3b8">Company: Global Digital Solutions</text>
        <text x="16" y="128" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="#10b981">✓ Auto-appended to all drafts</text>
      </g>

      <!-- Quick Tones -->
      <g transform="translate(0, 230)">
        <text x="0" y="16" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#ffffff">Quick Action Drafts</text>

        <rect y="30" width="150" height="36" rx="8" fill="#0078d4" />
        <text x="75" y="53" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">Polite Pushback</text>

        <rect x="160" y="30" width="152" height="36" rx="8" fill="#1e293b" />
        <text x="236" y="53" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#94a3b8" text-anchor="middle">Executive Status</text>

        <rect y="76" width="150" height="36" rx="8" fill="#1e293b" />
        <text x="75" y="99" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#94a3b8" text-anchor="middle">Reschedule Meeting</text>

        <rect x="160" y="76" width="152" height="36" rx="8" fill="#1e293b" />
        <text x="236" y="99" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#94a3b8" text-anchor="middle">Friendly Follow-up</text>
      </g>

      <!-- Stash Tabs CTA -->
      <g transform="translate(0, 365)">
        <rect width="312" height="44" rx="8" fill="#6366f1" />
        <text x="156" y="27" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#ffffff" text-anchor="middle">
          🗂️ Stash Workspace (Ctrl+Shift+U)
        </text>
      </g>
    </g>
  </g>
</svg>
`;

console.log('🎨 Generating OfficeMate Store Listing Assets with Exact Pixel Dimensions...');

// 1. Small Promotional Tile (EXACTLY 440 x 280)
renderSvg(svgSmall, 440, 280, 'promo-small-440x280.png');

// 2. Large Promotional Tile (EXACTLY 1400 x 560)
renderSvg(svgMarquee, 1400, 560, 'promo-marquee-1400x560.png');

// 3. Screenshots (EXACTLY 1280 x 800)
renderSvg(svgShot1, 1280, 800, 'screenshot-1-outlook-smart-replies.png');
renderSvg(svgShot2, 1280, 800, 'screenshot-2-workspace-tab-stash.png');
renderSvg(svgShot3, 1280, 800, 'screenshot-3-teams-action-extractor.png');
renderSvg(svgShot4, 1280, 800, 'screenshot-4-floating-copilot-sidebar.png');

console.log('🎉 All OfficeMate Microsoft Store assets generated successfully with exact required dimensions!');

