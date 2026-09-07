import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env / .env.local so server.proxy below can read VITE_BACKEND_PROXY_TARGET
  // (Vite only does this automatically for client code via import.meta.env, not here).
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      // Proxies relative /api/* calls to the NestJS backend during local dev,
      // so the browser sees a single origin (avoids CORS/cookie edge cases)
      // and the frontend code needs no hardcoded backend port.
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_PROXY_TARGET || 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: (chunkInfo) => {
            const sanitized = (chunkInfo.name || 'chunk').replace(/error/gi, 'err');
            return `assets/${sanitized}-[hash].js`;
          },
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || 'asset';
            const sanitized = name.replace(/error/gi, 'err');
            return `assets/${sanitized}-[hash][extname]`;
          },
          manualChunks(id) {
            if (id.includes('node_modules/recharts')) {
              return 'charts-vendor';
            }
          },
        },
      },
    },
  }
})
