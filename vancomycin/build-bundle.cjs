let esbuild;
try {
  esbuild = require('C:/Users/nguye/AppData/Roaming/npm/node_modules/esbuild');
} catch (e) {
  try {
    esbuild = require('esbuild');
  } catch (e2) {
    esbuild = require(path.resolve(__dirname, '../node_modules/esbuild'));
  }
}
const path = require('path');
const fs = require('fs');

let jspdfPath;
try {
  jspdfPath = require.resolve('jspdf/dist/jspdf.umd.min.js');
} catch (e) {
  const candidate1 = path.resolve(__dirname, '../node_modules/jspdf/dist/jspdf.umd.min.js');
  const candidate2 = path.resolve(__dirname, '../antibiotic/node_modules/jspdf/dist/jspdf.umd.min.js');
  if (fs.existsSync(candidate1)) {
    jspdfPath = candidate1;
  } else if (fs.existsSync(candidate2)) {
    jspdfPath = candidate2;
  }
}

const lucidePath = path.resolve(__dirname, '../antibiotic/node_modules/lucide-react/dist/cjs/lucide-react.js');

const ignoreCssPlugin = {
  name: 'ignore-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'ignore-css' }));
    build.onLoad({ filter: /.*/, namespace: 'ignore-css' }, () => ({ contents: '', loader: 'js' }));
  }
};

(async () => {
  try {
    console.log('[build-vancomycin] Compiling Vancomycin CDSS bundles...');

    const aliasConfig = {
      ...(jspdfPath ? { 'jspdf': jspdfPath } : {}),
      ...(fs.existsSync(lucidePath) ? { 'lucide-react': lucidePath } : {})
    };
    const nodeModulesPath = path.resolve(__dirname, '../antibiotic/node_modules');

    // 1. Build ES Module bundle for modern browser loading
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/index-DueZW2ru.js'),
      format: 'esm',
      platform: 'browser',
      jsx: 'automatic',
      minify: false,
      plugins: [ignoreCssPlugin],
      alias: aliasConfig,
      nodePaths: [nodeModulesPath],
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('Successfully built assets/index-DueZW2ru.js (ESM)!');

    // 2. Build IIFE standalone bundle for offline file:/// fallback
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/vancomycin-app.iife.js'),
      format: 'iife',
      platform: 'browser',
      jsx: 'automatic',
      minify: false,
      plugins: [ignoreCssPlugin],
      alias: aliasConfig,
      nodePaths: [nodeModulesPath],
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('Successfully built assets/vancomycin-app.iife.js (IIFE)!');

    // 3. Sync to dist/vancomycin/assets if dist exists
    const distJs1 = path.resolve(__dirname, '../dist/vancomycin/assets/index-DueZW2ru.js');
    const distJs2 = path.resolve(__dirname, '../dist/vancomycin/assets/vancomycin-app.iife.js');
    if (fs.existsSync(path.dirname(distJs1))) {
      fs.copyFileSync(path.resolve(__dirname, 'assets/index-DueZW2ru.js'), distJs1);
      fs.copyFileSync(path.resolve(__dirname, 'assets/vancomycin-app.iife.js'), distJs2);
      console.log('✓ Successfully synced JS bundles to dist/vancomycin/assets/!');
    }
  } catch (err) {
    console.error('Bundle error:', err);
    process.exit(1);
  }
})();
