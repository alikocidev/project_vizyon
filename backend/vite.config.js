import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [],
            refresh: false,
        }),
    ],
    build: {
        outDir: 'public/build',
        manifest: true,
    }
});
