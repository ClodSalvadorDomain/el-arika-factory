import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { htmlPartials } from './tools/html-partials.js';

const root = import.meta.dirname;
export const pages = ['index', 'category', 'product', 'cart', 'stores', 'showroom', 'styleguide'];

export default defineConfig({
  base: './',
  plugins: [htmlPartials(root), react()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(root, `${p}.html`)])),
    },
  },
});
