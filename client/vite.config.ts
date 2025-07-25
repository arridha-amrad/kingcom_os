import { defineConfig } from 'vitest/config';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://rajaongkir.komerce.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1/destination'),
      },
      '/calc': {
        target: 'https://rajaongkir.komerce.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/calc/, '/api/v1/calculate'),
      },
    },
  },
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
