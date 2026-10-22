import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {}
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dengue: resolve(__dirname, 'dengue/index.html'),
        ecg: resolve(__dirname, 'ecg/index.html'),
        abg: resolve(__dirname, 'abg/index.html'),
        hepa: resolve(__dirname, 'hepa/index.html'),
        sepsis: resolve(__dirname, 'sepsis/index.html'),
        antibiotic: resolve(__dirname, 'antibiotic/index.html'),
        vancomycin: resolve(__dirname, 'vancomycin/index.html'),
        diacare: resolve(__dirname, 'diacare/index.html'),
        inpatient: resolve(__dirname, 'inpatient/index.html'),
        csf: resolve(__dirname, 'csf/index.html')
      }
    }
  }
});
