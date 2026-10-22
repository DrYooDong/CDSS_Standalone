const path = require('path');
const esbuild = require('esbuild');

const ignoreCssPlugin = {
  name: 'ignore-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'ignore-css' }));
    build.onLoad({ filter: /.*/, namespace: 'ignore-css' }, () => ({ contents: '', loader: 'js' }));
  }
};

(async () => {
  try {
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/csf-app.iife.js'),
      format: 'iife',
      platform: 'browser',
      jsx: 'automatic',
      minify: false,
      plugins: [ignoreCssPlugin],
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('✓ Successfully created assets/csf-app.iife.js');
  } catch (err) {
    console.error('Bundle error:', err);
    process.exit(1);
  }
})();
