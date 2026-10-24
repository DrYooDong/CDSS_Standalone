import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  console.log('[build-css] Starting full Tailwind CSS compilation for HepaCDSS...');
  
  // 1. Load Tailwind v4 compiler
  let compile;
  try {
    const twNode = await import('file:///C:/Users/nguye/AppData/Local/Temp/docspace-pkg/node_modules/@tailwindcss/node/dist/index.js');
    compile = twNode.compile;
  } catch (e) {
    try {
      const twNode = await import('@tailwindcss/node');
      compile = twNode.compile;
    } catch (e2) {
      console.error('Could not load @tailwindcss/node:', e2);
      process.exit(1);
    }
  }
  
  // 2. Scan all candidates from src/ and index.html
  function scanFiles(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
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
    base: path.resolve(__dirname, '../antibiotic'),
    onDependency: () => {}
  });

  const compiledCss = compiler.build([...candidates]);
  console.log(`[build-css] Generated CSS: ${compiledCss.length} bytes.`);

  // 4. Save to assets/index-C2hJf_43.css
  const assetsDir = path.resolve(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  fs.writeFileSync(path.resolve(assetsDir, 'index-C2hJf_43.css'), compiledCss, 'utf8');

  // Also sync to dist/hepa/assets if dist exists
  const distCss = path.resolve(__dirname, '../dist/hepa/assets/index-C2hJf_43.css');
  if (fs.existsSync(path.dirname(distCss))) {
    fs.writeFileSync(distCss, compiledCss, 'utf8');
    console.log('[build-css] Successfully synced to dist/hepa/assets/!');
  }

  console.log('[build-css] ✓ Complete! All HepaCDSS Tailwind CSS utilities are now generated.');
}

run().catch(err => {
  console.error('[build-css] Error:', err);
  process.exit(1);
});
