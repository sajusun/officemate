import { build } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

async function runBuild() {
  const rootDir = process.cwd();
  const distDir = resolve(rootDir, 'dist');

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  console.log('📦 Step 1: Building OfficeMate Popup...');
  await build({
    configFile: false,
    base: '',
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      rollupOptions: {
        input: {
          popup: resolve(rootDir, 'src/popup/popup.html')
        }
      }
    }
  });

  console.log('⚙️ Step 2: Building Background Service Worker (Workspace Stash Engine)...');
  await build({
    configFile: false,
    build: {
      outDir: 'dist',
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
      outDir: 'dist',
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

  console.log('📋 Step 5: Copying Manifest and High-Res Icons...');
  const manifest = fs.readFileSync(resolve(rootDir, 'manifest.json'), 'utf-8');
  fs.writeFileSync(resolve(distDir, 'manifest.json'), manifest);

  const iconsSrc = resolve(rootDir, 'public/icons');
  const iconsDist = resolve(distDir, 'icons');
  if (fs.existsSync(iconsSrc)) {
    fs.cpSync(iconsSrc, iconsDist, { recursive: true });
  }

  console.log('✅ OfficeMate for Edge build completed successfully! Load unpacked from ./dist in Microsoft Edge or Chrome.');
}

runBuild().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
