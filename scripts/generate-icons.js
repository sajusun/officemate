import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svg = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="officeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0078d4" />
      <stop offset="50%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="goldSpark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0e7ff" />
    </linearGradient>
  </defs>

  <!-- Background Squircle -->
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#officeBg)" />
  <rect x="6.5" y="6.5" width="115" height="115" rx="27.5" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />

  <!-- Executive Envelope / Workspace Card -->
  <rect x="26" y="38" width="76" height="54" rx="8" fill="url(#cardGrad)" />
  
  <!-- Envelope Flap / Folder Fold -->
  <path d="M 26 44 L 64 68 L 102 44" fill="none" stroke="#4f46e5" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Office 365 / Copilot Ribbon Accent -->
  <rect x="36" y="74" width="30" height="4" rx="2" fill="#0078d4" />
  <rect x="36" y="82" width="46" height="4" rx="2" fill="#818cf8" />

  <!-- Copilot AI Star / Sparkle in Top-Right -->
  <circle cx="94" cy="30" r="14" fill="#1e1b4b" />
  <circle cx="94" cy="30" r="12" fill="url(#goldSpark)" />
  <path d="M 94 22 L 96.5 27.5 L 102 30 L 96.5 32.5 L 94 38 L 91.5 32.5 L 86 30 L 91.5 27.5 Z" fill="#ffffff" />
</svg>
`;

const outDir = path.resolve('public/icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const size of [16, 32, 48, 128]) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: size,
    },
  });
  const pngBuffer = resvg.render().asPng();
  const filePath = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Generated OfficeMate icon: ${filePath} (${size}x${size})`);
}
