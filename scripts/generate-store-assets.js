import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const outDir = path.resolve('public/store-assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. 600x600 Square High-Res Store Icon & Gumroad Thumbnail
const svg600 = `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1128" />
      <stop offset="45%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>

    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0078d4" />
      <stop offset="60%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Corporate Dark Canvas -->
  <rect width="600" height="600" rx="90" fill="url(#bgGrad)" />
  <rect x="2" y="2" width="596" height="596" rx="88" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3" />

  <!-- Ambient Copilot Azure Glow -->
  <circle cx="300" cy="270" r="190" fill="#0078d4" opacity="0.22" filter="url(#softGlow)" />
  <circle cx="440" cy="180" r="110" fill="#6366f1" opacity="0.28" filter="url(#softGlow)" />

  <!-- Center Floating App Squircle -->
  <rect x="130" y="110" width="340" height="340" rx="76" fill="url(#primaryGrad)" filter="url(#softGlow)" />
  <rect x="132" y="112" width="336" height="336" rx="74" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="4" />

  <!-- Executive Envelope Card -->
  <rect x="185" y="200" width="230" height="160" rx="22" fill="url(#cardGrad)" />
  
  <!-- Envelope Flap / Folder Chevron -->
  <path d="M 185 220 L 300 295 L 415 220" fill="none" stroke="#4f46e5" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Accent Status Ribbons -->
  <rect x="215" y="305" width="95" height="11" rx="5" fill="#0078d4" />
  <rect x="215" y="325" width="140" height="11" rx="5" fill="#818cf8" />

  <!-- Floating Copilot AI Star Badge -->
  <circle cx="425" cy="155" r="46" fill="#0f172a" />
  <circle cx="425" cy="155" r="41" fill="url(#goldGrad)" filter="url(#softGlow)" />
  <path d="M 425 125 L 434 146 L 455 155 L 434 164 L 425 185 L 416 164 L 395 155 L 416 146 Z" fill="#ffffff" />

  <!-- Typography at bottom -->
  <text x="300" y="505" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="40" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">
    OfficeMate <tspan fill="#38bdf8">Copilot</tspan>
  </text>
  <text x="300" y="542" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="600" fill="#94a3b8" text-anchor="middle" letter-spacing="0.5">
    Outlook AI Drafts • Teams Notes • Workspaces
  </text>
</svg>
`;

// 2. 1280x720 Gumroad Cover & Store Showcase
const svg1280 = `
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="covBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060b18" />
      <stop offset="50%" stop-color="#0b132b" />
      <stop offset="100%" stop-color="#1c1954" />
    </linearGradient>

    <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0078d4" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>

    <linearGradient id="accentGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <filter id="cBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="60" result="b" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="url(#covBg)" />

  <!-- Ambient Light Orbs -->
  <circle cx="200" cy="200" r="300" fill="#0078d4" opacity="0.22" filter="url(#cBlur)" />
  <circle cx="1080" cy="500" r="350" fill="#6366f1" opacity="0.26" filter="url(#cBlur)" />

  <!-- Left Content Column -->
  <g transform="translate(110, 150)">
    <!-- Pill Badge -->
    <rect width="250" height="38" rx="19" fill="rgba(0,120,212,0.18)" stroke="rgba(56,189,248,0.4)" stroke-width="1.5" />
    <text x="125" y="24" font-family="'Segoe UI', system-ui, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">
      ⚡ MICROSOFT 365 COPILOT
    </text>

    <!-- Headline -->
    <text x="0" y="105" font-family="'Segoe UI', system-ui, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-0.5">
      OfficeMate for Edge
    </text>
    <text x="0" y="155" font-family="'Segoe UI', system-ui, sans-serif" font-size="28" font-weight="700" fill="url(#accentGold)">
      AI Email Drafts • Teams Notes • Workspaces
    </text>

    <!-- Description -->
    <text x="0" y="210" font-family="'Segoe UI', system-ui, sans-serif" font-size="18" fill="#cbd5e1" font-weight="400">
      Stop wasting hours typing repetitive corporate replies in Outlook Web.
    </text>
    <text x="0" y="238" font-family="'Segoe UI', system-ui, sans-serif" font-size="18" fill="#94a3b8" font-weight="400">
      OfficeMate injects executive 1-click email drafts, transcribes Teams action items,
    </text>
    <text x="0" y="266" font-family="'Segoe UI', system-ui, sans-serif" font-size="18" fill="#94a3b8" font-weight="400">
      and organizes messy tabs into one-click project workspaces.
    </text>

    <!-- Feature Tags -->
    <g transform="translate(0, 315)">
      <rect width="175" height="38" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <text x="87" y="24" font-family="'Segoe UI', system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">✉️ 1-Click Outlook AI</text>

      <rect x="190" width="185" height="38" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <text x="282" y="24" font-family="'Segoe UI', system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">📝 Teams Notes &amp; Action</text>

      <rect x="390" width="175" height="38" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <text x="477" y="24" font-family="'Segoe UI', system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0" text-anchor="middle">🗂️ Project Tab Stash</text>
    </g>

    <!-- Lifetime License Pill -->
    <g transform="translate(0, 385)">
      <rect width="260" height="48" rx="10" fill="url(#pGrad)" />
      <text x="130" y="30" font-family="'Segoe UI', system-ui, sans-serif" font-size="16" font-weight="800" fill="#ffffff" text-anchor="middle">
        👑 LIFETIME PRO LICENSE ($8.99)
      </text>
    </g>
  </g>

  <!-- Right Visual Mockup (App Squircle) -->
  <g transform="translate(850, 160)">
    <rect width="320" height="380" rx="40" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.15)" stroke-width="2" filter="url(#cBlur)" />
    
    <!-- Inner Card Header -->
    <rect x="25" y="25" width="270" height="50" rx="12" fill="rgba(255,255,255,0.05)" />
    <circle cx="50" cy="50" r="14" fill="#0078d4" />
    <text x="75" y="55" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="800" fill="#ffffff">OfficeMate Copilot</text>
    <rect x="235" y="40" width="45" height="20" rx="6" fill="#facc15" />
    <text x="257" y="54" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle">PRO</text>

    <!-- Tone Pills -->
    <rect x="25" y="90" width="130" height="28" rx="6" fill="#0078d4" />
    <text x="90" y="108" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">Polite Pushback</text>

    <rect x="165" y="90" width="130" height="28" rx="6" fill="rgba(255,255,255,0.08)" />
    <text x="230" y="108" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="#94a3b8" text-anchor="middle">Executive Status</text>

    <!-- Simulated Email Body -->
    <rect x="25" y="130" width="270" height="175" rx="10" fill="rgba(0,0,0,0.3)" />
    <text x="40" y="160" font-family="'Segoe UI', sans-serif" font-size="12" fill="#38bdf8" font-weight="700">Subject: Project Milestones Update</text>
    <text x="40" y="185" font-family="'Segoe UI', sans-serif" font-size="11" fill="#cbd5e1">Hi Team,</text>
    <text x="40" y="205" font-family="'Segoe UI', sans-serif" font-size="11" fill="#94a3b8">Thank you for sharing the requirements.</text>
    <text x="40" y="225" font-family="'Segoe UI', sans-serif" font-size="11" fill="#94a3b8">Our milestones remain fully on schedule.</text>
    <text x="40" y="245" font-family="'Segoe UI', sans-serif" font-size="11" fill="#94a3b8">Review call set for Thursday at 2 PM.</text>
    <text x="40" y="275" font-family="'Segoe UI', sans-serif" font-size="11" fill="#cbd5e1">Best regards, Senior Product Lead</text>

    <!-- Insert Button -->
    <rect x="25" y="320" width="270" height="38" rx="8" fill="url(#pGrad)" />
    <text x="160" y="344" font-family="'Segoe UI', sans-serif" font-size="13" font-weight="800" fill="#ffffff" text-anchor="middle">⚡ Insert into Outlook Reply</text>
  </g>
</svg>
`;

function renderPng(svgStr, width, outPath) {
  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: width } });
  const png = resvg.render().asPng();
  fs.writeFileSync(outPath, png);
  console.log(`Generated: ${outPath} (${width}px)`);
}

// Render Assets
renderPng(svg600, 300, path.join(outDir, 'icon-300.png'));
renderPng(svg600, 600, path.join(outDir, 'icon-600.png'));
renderPng(svg600, 600, path.join(outDir, 'gumroad-thumbnail-600x600.png'));
renderPng(svg1280, 1280, path.join(outDir, 'gumroad-cover-1280x720.png'));
renderPng(svg1280, 440, path.join(outDir, 'promo-small-440x280.png'));
renderPng(svg1280, 1400, path.join(outDir, 'promo-marquee-1400x560.png'));

// Also copy icon-600 & gumroad thumbnail to artifacts folder
const brainDir = path.resolve('C:/Users/Dell/.gemini/antigravity/brain/a7a1c9b0-1c53-4d79-b5ca-55d44ae9ba88');
if (fs.existsSync(brainDir)) {
  fs.copyFileSync(path.join(outDir, 'icon-600.png'), path.join(brainDir, 'officemate-icon-600.png'));
  fs.copyFileSync(path.join(outDir, 'gumroad-thumbnail-600x600.png'), path.join(brainDir, 'officemate-gumroad-thumbnail-600x600.png'));
  console.log('Copied to artifacts directory!');
}

