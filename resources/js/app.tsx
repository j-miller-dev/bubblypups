import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';

import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'jmdev Laravel project';

// 1. Hard refresh your browser (Ctrl+Shift+R)
// 2. Clear all cookies for 127.0.0.1
// 3. Try logging in again
//
// The 419 is likely from stale cookies. Inertia handles CSRF automatically if the meta tag exists!

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const pages = import.meta.glob('./Pages/**/*.{jsx,tsx}');

        // Try .tsx first, then .jsx
        const tsxPath = `./Pages/${name}.tsx`;
        const jsxPath = `./Pages/${name}.jsx`;

        if (pages[tsxPath]) {
            return pages[tsxPath]();
        } else if (pages[jsxPath]) {
            return pages[jsxPath]();
        }

        throw new Error(`Page not found: ${name}`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
