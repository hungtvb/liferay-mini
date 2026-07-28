import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

const apiOrigin = process.env.IMPORTER_API_ORIGIN || 'http://127.0.0.1:4174';

export default defineConfig({
  root: 'ui',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    emptyOutDir: true,
    outDir: '../public',
    sourcemap: true
  },
  server: {
    port: 5173,
    proxy: {
      '/api': apiOrigin
    }
  }
});