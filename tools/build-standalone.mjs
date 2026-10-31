// Builds standalone/: every page as one self-contained HTML file (CSS and JS
// inlined) so the site opens by double-click, with no server. Browsers refuse
// module scripts loaded from file:// URLs, but inline ones run fine.
// Usage: npm run build:standalone
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { cpSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { htmlPartials } from './html-partials.js';
import { pages } from '../vite.config.js';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'standalone');

rmSync(out, { recursive: true, force: true });

for (const page of pages) {
  await build({
    root,
    configFile: false,
    base: './',
    logLevel: 'warn',
    publicDir: false,
    plugins: [htmlPartials(root), react(), viteSingleFile({ removeViteModuleLoader: true })],
    build: {
      target: 'es2022',
      outDir: out,
      emptyOutDir: false,
      chunkSizeWarningLimit: 4000,
      rollupOptions: { input: resolve(root, `${page}.html`) },
    },
  });
  console.log(`built ${page}.html`);
}

cpSync(resolve(root, 'public/img'), resolve(out, 'img'), { recursive: true });
console.log('done: open standalone/index.html');
