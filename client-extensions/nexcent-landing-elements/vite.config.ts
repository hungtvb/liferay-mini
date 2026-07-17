import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
import {defineConfig} from 'vite';

export default defineConfig({
    build: {
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/index.tsx'),
            fileName: () => 'index.js',
            formats: ['es'],
        },
        outDir: 'build',
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
