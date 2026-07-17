import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

export default defineConfig({
    build: {
        emptyOutDir: true,
        lib: {
            entry: fileURLToPath(new URL('./src/index.tsx', import.meta.url)),
            fileName: () => 'index.js',
            formats: ['es'],
        },
        outDir: 'dist',
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) =>
                    assetInfo.name?.endsWith('.css')
                        ? 'style.css'
                        : 'assets/[name][extname]',
            },
        },
    },
    plugins: [react()],
});
