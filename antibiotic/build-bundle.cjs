let esbuild;
try {
  esbuild = require('C:/Users/nguye/AppData/Roaming/npm/node_modules/esbuild');
} catch (e) {
  esbuild = require('esbuild');
}
const path = require('path');

const ignoreCssPlugin = {
  name: 'ignore-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'ignore-css' }));
    build.onLoad({ filter: /.*/, namespace: 'ignore-css' }, () => ({ contents: '', loader: 'js' }));
  }
};

(async () => {
  try {
    console.log('[build-antibiotic] Compiling InfectoDose CDSS bundles...');

    // 1. Build ES Module bundle for modern browser loading
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/index-DDo0RMpo.js'),
      format: 'esm',
      platform: 'browser',
      jsx: 'automatic',
      minify: false,
      plugins: [ignoreCssPlugin],
      alias: {
        'jspdf': path.resolve(__dirname, 'node_modules/jspdf/dist/jspdf.umd.min.js')
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('✓ Successfully compiled assets/index-DDo0RMpo.js (ESM)');

    // 2. Build IIFE standalone bundle for offline file:/// fallback
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/antibiotic-app.iife.js'),
      format: 'iife',
      platform: 'browser',
      jsx: 'automatic',
      minify: false,
      plugins: [ignoreCssPlugin],
      alias: {
        'jspdf': path.resolve(__dirname, 'node_modules/jspdf/dist/jspdf.umd.min.js')
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('✓ Successfully compiled assets/antibiotic-app.iife.js (IIFE)');
    console.log('[build-antibiotic] All production bundles updated successfully!');
  } catch (err) {
    console.error('Bundle error:', err);
    process.exit(1);
  }
})();
