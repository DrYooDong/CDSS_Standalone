const path = require('path');
const nodeModulesPath = 'C:/Users/nguye/AppData/Local/Temp/docspace-pkg/node_modules';
let esbuild;
try {
  esbuild = require(path.join(nodeModulesPath, 'esbuild'));
} catch {
  try {
    esbuild = require('esbuild');
  } catch {
    esbuild = require('C:/Users/nguye/AppData/Roaming/npm/node_modules/esbuild');
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
    console.log('Building IIFE bundle with esbuild...');
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/csf-app.iife.js'),
      format: 'iife',
      platform: 'browser',
      jsx: 'automatic',
      nodePaths: [nodeModulesPath],
      minify: false,
      plugins: [ignoreCssPlugin],
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    console.log('Building ESM bundle with esbuild...');
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      outfile: path.resolve(__dirname, 'assets/index-BnZJokFk.js'),
      format: 'esm',
      platform: 'browser',
      jsx: 'automatic',
      nodePaths: [nodeModulesPath],
      minify: false,
      plugins: [ignoreCssPlugin],
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    console.log('✓ Successfully created assets/csf-app.iife.js and assets/index-BnZJokFk.js');
  } catch (err) {
    console.error('Bundle error:', err);
    process.exit(1);
  }
})();
