import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { vercelApiPlugin } from './vite-plugin-api';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Expose NOTION_* to the Vite API middleware (server-only; never VITE_-prefixed).
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of [
    'NOTION_TOKEN',
    'NOTION_PROPERTIES_DB_ID',
    'NOTION_BLOG_DB_ID',
    'NOTION_CONTACTS_DB_ID',
    'NOTION_VALUATION_DB_ID',
  ]) {
    if (env[key] && !process.env[key]) {
      process.env[key] = env[key];
    }
  }

  return {
    plugins: [react(), vercelApiPlugin()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
    preview: {
      host: '127.0.0.1',
      port: 4173,
    },
  };
});
