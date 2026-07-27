import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

import {normalizeCssDeclarationValue} from './src/build/cssContract';

type CssDeclaration = {
    value: string;
};

const nexcentCssContractPlugin = {
    postcssPlugin: 'nexcent-css-contract',
    Declaration(declaration: CssDeclaration) {
        declaration.value = normalizeCssDeclarationValue(declaration.value);
    },
};

export default defineConfig({
    build: {
        emptyOutDir: true,
        lib: {
            entry: fileURLToPath(new URL('./src/index.tsx', import.meta.url)),
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
    css: {
        postcss: {
            plugins: [nexcentCssContractPlugin],
        },
    },
    plugins: [react()],
});
