import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        crx({ manifest: manifest })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@/components': resolve(__dirname, 'src/components'),
            '@/lib': resolve(__dirname, 'src/lib'),
            '@/types': resolve(__dirname, 'src/types'),
            '@/hooks': resolve(__dirname, 'src/hooks'),
            '@/utils': resolve(__dirname, 'src/utils'),
            '@/styles': resolve(__dirname, 'src/styles'),
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                background: resolve(__dirname, 'public/background.js'),
            },
            output: {
                entryFileNames: function (chunk) {
                    return chunk.name === 'background' ? '[name].js' : 'assets/[name]-[hash].js';
                },
            },
        },
    },
    server: {
        port: 3000,
        strictPort: true,
    },
    define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    },
});
