import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'path';
import { defineConfig } from 'vite';
import { routes } from './src/routes';

const publicRoutes = routes
  .filter((route) => !route.noIndex && route.path !== '/')
  .map((route) => route.path.replace(/^\/+|\/+$/g, ''))
  .filter(Boolean);

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

export default defineConfig(() => ({
  plugins: [react(), tailwindcss(), staticRouteFallbacks()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
