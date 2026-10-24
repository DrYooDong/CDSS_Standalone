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
  const candidate2 = path.resolve(__dirname, 'node_modules/jspdf/dist/jspdf.umd.min.js');
  if (fs.existsSync(candidate1)) {
    jspdfPath = candidate1;
  } else if (fs.existsSync(candidate2)) {
    jspdfPath = candidate2;
  }
}

const ignoreCssPlugin = {
  name: 'ignore-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'ignore-css' }));
    build.onLoad({ filter: /.*/, namespace: 'ignore-css' }, () => ({ contents: '', loader: 'js' }));
  }
};

(async () => {
  try {
    console.log('[build-hepa] Compiling HepaCDSS bundles...');

    const antibioticNm = path.resolve(__dirname, '../antibiotic/node_modules');
    const aliasConfig = {
      '@': path.resolve(__dirname, 'src'),
      'lucide-react': path.resolve(antibioticNm, 'lucide-react'),
      'react': path.resolve(antibioticNm, 'react'),
      'react-dom': path.resolve(antibioticNm, 'react-dom'),
      'react/jsx-runtime': path.resolve(antibioticNm, 'react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(antibioticNm, 'react/jsx-dev-runtime.js'),
    };
    if (jspdfPath) {
      aliasConfig['jspdf'] = jspdfPath;
    }

    // Ensure assets directory exists
    const assetsDir = path.resolve(__dirname, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // 1. Build ES Module bundle for modern browser loading
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/index-LLxX_tuB.js'),
      format: 'esm',
      platform: 'browser',
      jsx: 'automatic',
      minify: false,
      plugins: [ignoreCssPlugin],
      nodePaths: [
        path.resolve(__dirname, '../antibiotic/node_modules'),
        path.resolve(__dirname, '../node_modules')
      ],
      alias: aliasConfig,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('✓ Successfully compiled assets/index-LLxX_tuB.js (ESM)');

    // 2. Build IIFE standalone bundle for offline file:/// fallback
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/hepa-app.iife.js'),
      format: 'iife',
      platform: 'browser',
      jsx: 'automatic',
      minify: false,
      plugins: [ignoreCssPlugin],
      nodePaths: [
        path.resolve(__dirname, '../antibiotic/node_modules'),
        path.resolve(__dirname, '../node_modules')
      ],
      alias: aliasConfig,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('✓ Successfully compiled assets/hepa-app.iife.js (IIFE)');

    // 3. Sync to dist/hepa/assets if dist exists
    const distJs1 = path.resolve(__dirname, '../dist/hepa/assets/index-LLxX_tuB.js');
    const distJs2 = path.resolve(__dirname, '../dist/hepa/assets/hepa-app.iife.js');
    if (fs.existsSync(path.dirname(distJs1))) {
      fs.copyFileSync(path.resolve(__dirname, 'assets/index-LLxX_tuB.js'), distJs1);
      fs.copyFileSync(path.resolve(__dirname, 'assets/hepa-app.iife.js'), distJs2);
      console.log('✓ Successfully synced JS bundles to dist/hepa/assets/!');
    }

    console.log('[build-hepa] All HepaCDSS production bundles updated successfully!');
  } catch (err) {
    console.error('Bundle error:', err);
    process.exit(1);
  }
})();
