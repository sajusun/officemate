import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const targetArg = process.argv.find((arg) => arg.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1] : 'all'; // 'chrome' | 'firefox' | 'all'

const pkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf-8'));
const version = pkg.version || '1.0.0';

function packageSourceCode(rootDir, extName) {
  const sourceZip = path.resolve(rootDir, `${extName}-source-code.zip`);
  if (fs.existsSync(sourceZip)) fs.unlinkSync(sourceZip);

  const candidateItems = [
    'src',
    'public',
    'scripts',
    'manifest.json',
    'package.json',
    'tsconfig.json',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'vite.config.ts',
    'BUILD.md'
  ];

  const existingItems = candidateItems.filter((item) => fs.existsSync(path.resolve(rootDir, item)));

  console.log(`\n📦 Step 3: Packaging clean source code archive for Mozilla AMO reviewers...`);
  try {
    execSync(`tar -a -c -f "${sourceZip}" ${existingItems.join(' ')}`, { cwd: rootDir, stdio: 'inherit' });
    const stats = fs.statSync(sourceZip);
    console.log(`✅ Success! Created source code archive: ${path.basename(sourceZip)} (${(stats.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`⚠️ Failed to create source zip:`, err);
  }
}

function packageForTarget(currentTarget) {
  const isFirefox = currentTarget === 'firefox';
  const folder = isFirefox ? 'dist-firefox' : 'dist';
  const label = isFirefox ? 'firefox' : 'edge';
  const distDir = path.resolve(rootDir, folder);

  const zipNamed = path.resolve(rootDir, `officemate-${label}-v${version}.zip`);
  const zipGeneric = isFirefox ? null : path.resolve(rootDir, 'officemate.zip');

  if (!fs.existsSync(distDir)) {
    console.error(`❌ ${folder} does not exist! Please build target first.`);
    return;
  }

  console.log(`\n📦 Packaging ${label.toUpperCase()} extension from ./${folder}...`);

  if (fs.existsSync(zipNamed)) fs.unlinkSync(zipNamed);
  if (zipGeneric && fs.existsSync(zipGeneric)) fs.unlinkSync(zipGeneric);

  // Compress with POSIX forward-slashes (required by Firefox AMO validator)
  try {
    execSync(`tar -a -c -f "${zipNamed}" *`, { cwd: distDir, stdio: 'inherit' });
    if (zipGeneric) {
      fs.copyFileSync(zipNamed, zipGeneric);
    }
  } catch (_e) {
    if (process.platform === 'win32') {
      execSync(
        `powershell -NoProfile -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipNamed}' -Force"`,
        { stdio: 'inherit' }
      );
      if (zipGeneric) {
        execSync(`powershell -NoProfile -Command "Copy-Item '${zipNamed}' -Destination '${zipGeneric}' -Force"`, {
          stdio: 'inherit'
        });
      }
    } else {
      execSync(`cd ${folder} && zip -r "${zipNamed}" . && cd ..`, { stdio: 'inherit' });
      if (zipGeneric) {
        fs.copyFileSync(zipNamed, zipGeneric);
      }
    }
  }

  const stats = fs.statSync(zipNamed);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`✅ Successfully created: ${path.basename(zipNamed)} (${sizeKb} KB)`);

  if (isFirefox) {
    packageSourceCode(rootDir, 'officemate');
  }
}

if (target === 'all') {
  packageForTarget('chrome');
  packageForTarget('firefox');
} else {
  packageForTarget(target);
}
