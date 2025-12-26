import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/n8n': {
          target: env.N8N_TARGET_URL || 'https://n8n8.localhost.online/webhook-test',
          changeOrigin: true,
          rewrite: (path) => {
            // Transform /api/n8n/invoice-upload -> /invoice-upload
            const newPath = path.replace(/^\/api\/n8n/, '');
            console.log(`Proxy rewrite: ${path} -> ${newPath}`);
            return newPath;
          },
          secure: true,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const targetPath = req.url.replace(/^\/api\/n8n/, '');
              const targetUrl = env.N8N_TARGET_URL || 'https://n8n8.localhost.online/webhook-test';
              console.log('Proxying request to:', `${targetUrl}${targetPath}`);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Proxy response status:', proxyRes.statusCode);
            });
            proxy.on('error', (err, req, res) => {
              console.error('Proxy error:', err);
            });
          }
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.N8N_BASE_URL': JSON.stringify('/api/n8n'),
      'process.env.N8N_API_KEY': JSON.stringify(env.N8N_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
