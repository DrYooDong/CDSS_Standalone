import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('[postbuild] Syncing static runtime assets into dist directory...');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Create .nojekyll for GitHub Pages
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✓ Created dist/.nojekyll');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
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

// 2. Copy shared shell assets
copyRecursive(path.join(rootDir, 'shared'), path.join(distDir, 'shared'));
console.log('✓ Copied shared/ -> dist/shared/');

// 3. Copy css folder
copyRecursive(path.join(rootDir, 'css'), path.join(distDir, 'css'));
console.log('✓ Copied css/ -> dist/css/');

// 4. Copy cdss-hub-bundle.js
const hubBundle = path.join(rootDir, 'cdss-hub-bundle.js');
if (fs.existsSync(hubBundle)) {
  fs.copyFileSync(hubBundle, path.join(distDir, 'cdss-hub-bundle.js'));
  console.log('✓ Copied cdss-hub-bundle.js -> dist/');
}

// 5. Copy manifest.webmanifest and sw.js
const manifest = path.join(rootDir, 'manifest.webmanifest');
if (fs.existsSync(manifest)) {
  fs.copyFileSync(manifest, path.join(distDir, 'manifest.webmanifest'));
}
const sw = path.join(rootDir, 'sw.js');
if (fs.existsSync(sw)) {
  fs.copyFileSync(sw, path.join(distDir, 'sw.js'));
}

// 6. Copy dengue runtime bundles & css
copyRecursive(path.join(rootDir, 'dengue', 'css'), path.join(distDir, 'dengue', 'css'));
['dengue-bundle.js', 'dengue-bundle.iife.js'].forEach(file => {
  const src = path.join(rootDir, 'dengue', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, 'dengue', file));
  }
});
console.log('✓ Copied dengue bundles and css -> dist/dengue/');

// 7. Copy ecg runtime bundles, css, and python output
copyRecursive(path.join(rootDir, 'ecg', 'css'), path.join(distDir, 'ecg', 'css'));
copyRecursive(path.join(rootDir, 'ecg', 'python', 'output'), path.join(distDir, 'ecg', 'python', 'output'));
['ecg-bundle.js'].forEach(file => {
  const src = path.join(rootDir, 'ecg', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, 'ecg', file));
  }
});
const ecgIife = path.join(rootDir, 'ecg', 'assets', 'ecg-app.iife.js');
if (fs.existsSync(ecgIife)) {
  const destDir = path.join(distDir, 'ecg', 'assets');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(ecgIife, path.join(destDir, 'ecg-app.iife.js'));
}
console.log('✓ Copied ecg bundles, css, and python output -> dist/ecg/');

console.log('[postbuild] Done! All assets ready for GitHub Pages deployment.');
