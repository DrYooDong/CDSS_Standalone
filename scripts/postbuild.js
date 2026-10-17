import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('[postbuild] Starting production deployment bundle sync...');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Ensure .nojekyll for GitHub Pages
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✓ Created dist/.nojekyll');

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.github',
  '__pycache__',
  '.vscode',
  '.idea',
  '.DS_Store'
];

function shouldIgnore(name) {
  if (IGNORE_PATTERNS.includes(name)) return true;
  if (name.endsWith('.pyc')) return true;
  return false;
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (shouldIgnore(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) {
      fs.mkdirSync(parent, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

// 2. Copy Root Entrypoints & Shell Assets
const rootFilesToCopy = [
  'index.html',
  'cdss-hub-bundle.js',
  'manifest.webmanifest',
  'sw.js',
  'metadata.json'
];

for (const file of rootFilesToCopy) {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`✓ Copied ${file} -> dist/${file}`);
  } else {
    console.warn(`⚠ Warning: Root file ${file} not found!`);
  }
}

// Also create 404.html from index.html for SPA / GitHub Pages fallback routing
if (fs.existsSync(path.join(rootDir, 'index.html'))) {
  fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, '404.html'));
  console.log('✓ Created dist/404.html (GitHub Pages fallback)');
}

// Copy shared and css directories
copyRecursive(path.join(rootDir, 'shared'), path.join(distDir, 'shared'));
console.log('✓ Copied shared/ -> dist/shared/');

copyRecursive(path.join(rootDir, 'css'), path.join(distDir, 'css'));
console.log('✓ Copied css/ -> dist/css/');

// 3. Copy all 9 CDSS Clinical Modules
const CDSS_MODULES = [
  'dengue',
  'ecg',
  'abg',
  'hepa',
  'sepsis',
  'antibiotic',
  'vancomycin',
  'diacare',
  'inpatient'
];

console.log('[postbuild] Syncing 9 CDSS clinical modules...');

for (const mod of CDSS_MODULES) {
  const srcModDir = path.join(rootDir, mod);
  const destModDir = path.join(distDir, mod);

  if (!fs.existsSync(srcModDir)) {
    console.error(`✗ Error: Module folder ${mod} does not exist in root!`);
    continue;
  }

  copyRecursive(srcModDir, destModDir);

  // Validation: Check that index.html exists in module dist
  const modIndex = path.join(destModDir, 'index.html');
  if (fs.existsSync(modIndex)) {
    console.log(`✓ Synced module [${mod}] -> dist/${mod}/ (index.html verified)`);
  } else {
    console.error(`✗ Warning: Module [${mod}] has NO index.html in dist!`);
  }
}

// 4. Final Verification
const requiredFiles = [
  'index.html',
  '404.html',
  '.nojekyll',
  'cdss-hub-bundle.js',
  'shared/cdss-shell.css',
  'shared/cdss-shell.js',
  'css/cdss-hub.css',
  ...CDSS_MODULES.map(m => `${m}/index.html`)
];

let allOk = true;
for (const relPath of requiredFiles) {
  const fullPath = path.join(distDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`✗ CRITICAL ERROR: Missing required build artifact: dist/${relPath}`);
    allOk = false;
  }
}

if (!allOk) {
  console.error('[postbuild] Build verification FAILED! Missing critical files.');
  process.exit(1);
}

console.log('[postbuild] SUCCESS: All 9 CDSS modules, root hub, and assets successfully synced into dist/!');
