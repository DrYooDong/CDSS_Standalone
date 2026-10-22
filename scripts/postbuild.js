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
  '.DS_Store',
  'src' // Do NOT copy raw TypeScript source directories into production dist
];

function shouldIgnore(name) {
  if (IGNORE_PATTERNS.includes(name)) return true;
  if (name.endsWith('.pyc')) return true;
  if (name.endsWith('.ts') && !name.endsWith('.d.ts')) return true; // Don't copy unbundled .ts files
  return false;
}

/**
 * Copies static assets safely WITHOUT overwriting Vite-compiled production HTML/JS bundles
 */
function copyRecursiveSafe(src, dest, isModuleRoot = false) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (shouldIgnore(entry)) continue;
      // Never overwrite Vite-compiled index.html in dist or module dist
      if (entry === 'index.html' && fs.existsSync(path.join(dest, entry))) {
        continue;
      }
      copyRecursiveSafe(path.join(src, entry), path.join(dest, entry), false);
    }
  } else {
    // If destination is index.html and already exists in dist (built by Vite), preserve the compiled version!
    if (path.basename(dest) === 'index.html' && fs.existsSync(dest)) {
      return;
    }
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) {
      fs.mkdirSync(parent, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

// 2. Copy Root Shell Assets (Without overwriting compiled dist/index.html)
const rootFilesToCopy = [
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

// Create 404.html from compiled dist/index.html for SPA / GitHub Pages fallback routing
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
  console.log('✓ Created dist/404.html from compiled dist/index.html');
} else if (fs.existsSync(path.join(rootDir, 'index.html'))) {
  fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, '404.html'));
  console.log('✓ Created dist/404.html from root index.html');
}

// Copy shared and css directories
copyRecursiveSafe(path.join(rootDir, 'shared'), path.join(distDir, 'shared'));
console.log('✓ Copied shared/ -> dist/shared/');

copyRecursiveSafe(path.join(rootDir, 'css'), path.join(distDir, 'css'));
console.log('✓ Copied css/ -> dist/css/');

// 3. Sync all 10 CDSS Clinical Modules safely
const CDSS_MODULES = [
  'dengue',
  'ecg',
  'abg',
  'hepa',
  'sepsis',
  'antibiotic',
  'vancomycin',
  'diacare',
  'inpatient',
  'csf'
];

console.log('[postbuild] Syncing supplementary assets for 10 CDSS clinical modules...');

for (const mod of CDSS_MODULES) {
  const srcModDir = path.join(rootDir, mod);
  const destModDir = path.join(distDir, mod);

  if (!fs.existsSync(srcModDir)) {
    console.error(`✗ Error: Module folder ${mod} does not exist in root!`);
    continue;
  }

  // Copy non-compiled assets (images, static css, presets) without overwriting Vite-compiled bundles
  copyRecursiveSafe(srcModDir, destModDir, true);

  // If Vite didn't output index.html for this module (e.g. pure static module), fallback copy
  const modIndex = path.join(destModDir, 'index.html');
  if (!fs.existsSync(modIndex) && fs.existsSync(path.join(srcModDir, 'index.html'))) {
    fs.copyFileSync(path.join(srcModDir, 'index.html'), modIndex);
    console.log(`✓ Copied fallback static index.html for [${mod}]`);
  }

  // Validation: Check that index.html exists in module dist and verify it does NOT contain raw .tsx
  if (fs.existsSync(modIndex)) {
    const htmlContent = fs.readFileSync(modIndex, 'utf8');
    if (htmlContent.includes('.tsx')) {
      console.warn(`⚠ Warning: Module [${mod}] index.html still references raw .tsx in dist!`);
    } else {
      console.log(`✓ Validated production module [${mod}] -> dist/${mod}/ (Production bundle verified)`);
    }
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

console.log('[postbuild] SUCCESS: All 10 CDSS modules, root hub, and assets verified and production-ready in dist/!');
