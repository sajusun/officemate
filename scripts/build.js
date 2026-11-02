import { build } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const targetArg = process.argv.find((arg) => arg.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1] : 'all'; // 'chrome' | 'firefox' | 'all'

async function buildTarget(currentTarget) {
  const isFirefox = currentTarget === 'firefox';
  const rootDir = process.cwd();
  const outDirName = isFirefox ? 'dist-firefox' : 'dist';
  const distDir = resolve(rootDir, outDirName);

  console.log(`\n========================================`);
  console.log(`🚀 Building OfficeMate for ${currentTarget.toUpperCase()} -> ./${outDirName}`);
  console.log(`========================================`);

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  console.log('📦 Step 1: Building OfficeMate Popup...');
  await build({
    configFile: false,
    base: '',
    build: {
      outDir: outDirName,
      emptyOutDir: false,
      rollupOptions: {
        input: {
          popup: resolve(rootDir, 'src/popup/popup.html')
        }
      }
    }
  });

  console.log('⚙️ Step 2: Building Background Script (Workspace Stash Engine)...');
  await build({
    configFile: false,
    build: {
      outDir: outDirName,
      emptyOutDir: false,
      lib: {
        entry: resolve(rootDir, 'src/background/index.ts'),
        formats: ['es'],
        fileName: () => 'background.js'
      }
    }
  });

  console.log('⚡ Step 3: Building Content Script (Outlook Copilot, Sidebar, Teams Grabber)...');
  await build({
    configFile: false,
    build: {
      outDir: outDirName,
      emptyOutDir: false,
      lib: {
        entry: resolve(rootDir, 'src/content/index.ts'),
        formats: ['iife'],
        name: 'OfficeMateEdge',
        fileName: () => 'content.js'
      }
    }
  });

  console.log('🎨 Step 4: Copying Sidebar CSS...');
  const sidebarCssSrc = resolve(rootDir, 'src/content/officemateSidebar.css');
  const sidebarCssDist = resolve(distDir, 'officemateSidebar.css');
  if (fs.existsSync(sidebarCssSrc)) {
    fs.copyFileSync(sidebarCssSrc, sidebarCssDist);
  }

  console.log('📋 Step 5: Preparing Manifest and High-Res Icons...');
  const manifestRaw = fs.readFileSync(resolve(rootDir, 'manifest.json'), 'utf-8');
  const manifest = JSON.parse(manifestRaw);

  if (isFirefox) {
    manifest.background = {
      scripts: ['background.js'],
      type: 'module'
    };
    manifest.browser_specific_settings = {
      gecko: {
        id: 'officemate@sajusun.github.io',
        strict_min_version: '109.0'
      }
    };
  }

  fs.writeFileSync(resolve(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  const iconsSrc = resolve(rootDir, 'public/icons');
  const iconsDist = resolve(distDir, 'icons');
  if (fs.existsSync(iconsSrc)) {
    fs.cpSync(iconsSrc, iconsDist, { recursive: true });
  }

  console.log(`✅ OfficeMate for ${currentTarget.toUpperCase()} build completed successfully -> ./${outDirName}`);
}

async function run() {
  if (target === 'all') {
    await buildTarget('chrome');
    await buildTarget('firefox');
  } else {
    await buildTarget(target);
  }
}

run().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
