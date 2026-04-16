import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { AppearanceProvider } from './contexts/AppearanceContext';

// Collect both sets of pages
const appPages = import.meta.glob('./pages/**/*.tsx');
const packagePages = import.meta.glob(
    '/vendor/susheelbhai/larapay/resources/js/pages/**/*.tsx',
);

let pageSource: string | null = null;

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => {
        // Try larapay first if source is 'larapay'
        if (
            pageSource === 'larapay' &&
            packagePages[
                `/vendor/susheelbhai/larapay/resources/js/pages/${name}.tsx`
            ]
        ) {
            return packagePages[
                `/vendor/susheelbhai/larapay/resources/js/pages/${name}.tsx`
            ]();
        }

        // Try app pages
        if (appPages[`./pages/${name}.tsx`]) {
            return appPages[`./pages/${name}.tsx`]();
        }

        // Fallback to package pages
        if (
            packagePages[
                `/vendor/susheelbhai/larapay/resources/js/pages/${name}.tsx`
            ]
        ) {
            return packagePages[
                `/vendor/susheelbhai/larapay/resources/js/pages/${name}.tsx`
            ]();
        }

        throw new Error(`Page not found: ${name}`);
    },
    setup({ el, App, props }) {
        // Store the flag globally before resolving pages
        if (typeof props.initialPage.props?.source === 'string') {
            pageSource = props.initialPage.props.source;
        }

        const root = createRoot(el);

        root.render(
            <AppearanceProvider>
                <App {...props} />
            </AppearanceProvider>,
        );
    },
    progress: {
        color: '#0212AC',
    },
});
