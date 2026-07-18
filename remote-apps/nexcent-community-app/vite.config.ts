import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
    base: './',
    build: {
        emptyOutDir: true,
        outDir: 'dist',
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) =>
                    assetInfo.name?.endsWith('.css')
                        ? 'style.css'
                        : 'assets/[name][extname]',
                entryFileNames: 'index.js',
            },
        },
    },
    plugins: [react()],
});
