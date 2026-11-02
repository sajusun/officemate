import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const targetArg = process.argv.find((arg) => arg.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1] : 'all'; // 'chrome' | 'firefox' | 'all'

const pkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf-8'));
const version = pkg.version || '1.0.0';

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

  const stats = fs.statSync(zipNamed);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`✅ Successfully created: ${path.basename(zipNamed)} (${sizeKb} KB)`);
}

if (target === 'all') {
  packageForTarget('chrome');
  packageForTarget('firefox');
} else {
  packageForTarget(target);
}
