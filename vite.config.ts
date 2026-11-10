import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

  const proxyConfig = (target: string) => ({
    target,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api\/[a-z-]+/, ''),
    configure: (proxy: {
      on: (event: string, handler: (...args: unknown[]) => void) => void;
    }) => {
      proxy.on('proxyReq', (proxyReq: { setHeader: (name: string, value: string) => void }) => {
        if (supabaseAnonKey) {
          proxyReq.setHeader('Authorization', `Bearer ${supabaseAnonKey}`);
        }
      });
    },
  });

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api/blog': proxyConfig('https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/notion-blog'),
        '/api/properties': proxyConfig('https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/notion-properties'),
        '/api/valuation-leads': proxyConfig('https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/notion-valuation'),
        '/api/contacts': proxyConfig('https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/notion-contacts'),
      },
    },
  };
});
