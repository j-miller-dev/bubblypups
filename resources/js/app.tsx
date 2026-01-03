import "../css/app.css";
import "./bootstrap";

import { createInertiaApp, router } from "@inertiajs/react";

import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "bubblypups dog grooming";

// Handle CSRF token expiration (419 errors) globally
router.on('error', (event) => {
    // Inertia passes the response in event.detail
    if (event.detail?.response?.status === 419) {
        if (confirm('Your session has expired. Would you like to reload the page?')) {
            window.location.reload();
        }
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const pages = import.meta.glob("./Pages/**/*.{jsx,tsx}");

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
        color: "#4B5563",
    },
});
