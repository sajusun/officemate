import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, 'dist');
const zipFile1 = path.resolve(rootDir, 'officemate-v1.0.0.zip');
const zipFile2 = path.resolve(rootDir, 'officemate.zip');

console.log('📦 Step 1: Running production build...');
execSync('npm run build', { stdio: 'inherit' });

if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found!');
  process.exit(1);
}

if (fs.existsSync(zipFile1)) fs.unlinkSync(zipFile1);
if (fs.existsSync(zipFile2)) fs.unlinkSync(zipFile2);

console.log('🤐 Step 2: Compressing dist into officemate-v1.0.0.zip & officemate.zip...');
const psCommand = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipFile1}' -Force; Copy-Item '${zipFile1}' -Destination '${zipFile2}' -Force"`;
execSync(psCommand, { stdio: 'inherit' });

const stats = fs.statSync(zipFile2);
console.log(`✅ Success! Packaged officemate.zip (${(stats.size / 1024).toFixed(1)} KB) ready for Microsoft Partner Center & Chrome Web Store!`);

