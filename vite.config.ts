import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'path';
import {defineConfig} from 'vite';

const publicRoutes = ['about', 'products', 'colors', 'factory', 'finishes', 'applications', 'partners', 'resources', 'contact', 'admin'];

const staticRouteFallbacks = () => ({
  name: 'whiterock-static-route-fallbacks',
  apply: 'build' as const,
  async closeBundle() {
    await Promise.all(publicRoutes.map(async (route) => {
      const routeDirectory = path.resolve(__dirname, 'dist', route);
      await mkdir(routeDirectory, { recursive: true });
      await copyFile(path.resolve(__dirname, 'dist', 'index.html'), path.join(routeDirectory, 'index.html'));
    }));
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), staticRouteFallbacks()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
