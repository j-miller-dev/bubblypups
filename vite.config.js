import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// Configure Herd/Valet HTTPS only when explicitly enabled via env to avoid errors when certs are missing.
const valetTlsDomain = process.env.VITE_VALET_TLS_DOMAIN || '';
const devHost = process.env.VITE_DEV_HOST || (valetTlsDomain || 'localhost');
const useHttps = Boolean(valetTlsDomain);

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            ...(valetTlsDomain ? { valetTls: valetTlsDomain } : {}),
        }),
        react({ fastRefresh: false }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        https: useHttps || undefined,
        host: devHost,
        hmr: {
            host: devHost,
        },
    },
});
