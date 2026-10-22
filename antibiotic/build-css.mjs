import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  console.log('[build-css] Starting full Tailwind CSS compilation...');
  
  // 1. Load Tailwind v4 compiler
  const { compile } = await import('file:///C:/Users/nguye/AppData/Local/Temp/docspace-pkg/node_modules/@tailwindcss/node/dist/index.js');
  
  // 2. Scan all candidates from src/
  function scanFiles(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        if (item !== 'node_modules' && item !== '.git') {
          files = files.concat(scanFiles(full));
        }
      } else if (/\.(tsx|ts|html|jsx|js)$/.test(item)) {
        files.push(full);
      }
    }
    return files;
  }

  const allFiles = scanFiles(path.resolve(__dirname, 'src')).concat([path.resolve(__dirname, 'index.html')]);
  const candidates = new Set();

  for (const f of allFiles) {
    const text = fs.readFileSync(f, 'utf8');
    // Extract words / candidate tokens
    const tokens = text.match(/[\w\-\:\[\]\/\.\%]+/g) || [];
    for (const t of tokens) {
      if (t.length > 1 && !t.startsWith('//')) {
        candidates.add(t);
      }
    }
  }

  console.log(`[build-css] Extracted ${candidates.size} potential Tailwind candidate tokens from ${allFiles.length} files.`);

  // 3. Compile Tailwind CSS
  const inputCss = fs.readFileSync(path.resolve(__dirname, 'src/index.css'), 'utf8');
  const compiler = await compile(inputCss, {
    base: __dirname,
    onDependency: () => {}
  });

  const compiledCss = compiler.build([...candidates]);
  console.log(`[build-css] Generated CSS: ${compiledCss.length} bytes.`);

  // 4. Save to assets/index-DDo0RMpo.css and assets/index-DVhYFEXB.css
  fs.writeFileSync(path.resolve(__dirname, 'assets/index-DDo0RMpo.css'), compiledCss, 'utf8');
  fs.writeFileSync(path.resolve(__dirname, 'assets/index-DVhYFEXB.css'), compiledCss, 'utf8');

  // Also sync to dist/
  const distCss1 = path.resolve(__dirname, '../dist/antibiotic/assets/index-DDo0RMpo.css');
  const distCss2 = path.resolve(__dirname, '../dist/antibiotic/assets/index-DVhYFEXB.css');
  if (fs.existsSync(path.dirname(distCss1))) {
    fs.writeFileSync(distCss1, compiledCss, 'utf8');
    fs.writeFileSync(distCss2, compiledCss, 'utf8');
    console.log('[build-css] Successfully synced to dist/antibiotic/assets/!');
  }

  console.log('[build-css] ✓ Complete! All Tailwind CSS utilities are now generated.');
}

run().catch(err => {
  console.error('[build-css] Error:', err);
  process.exit(1);
});
