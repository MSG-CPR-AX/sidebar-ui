/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
    plugins: [react()],
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
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                'dist/',
                'public/',
            ],
            thresholds: {
                lines: 80,
                branches: 80,
                functions: 80,
                statements: 80,
            },
        },
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },
    },
});
