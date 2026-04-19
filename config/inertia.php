<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    |
    | These options configures if and how Inertia uses Server Side Rendering
    | to pre-render each initial request made to your application's pages
    | so that server rendered HTML is delivered for the user's browser.
    |
    | See: https://inertiajs.com/server-side-rendering
    |
    */

    'ssr' => [
        /*
        | When enabled without a running SSR server (see Inertia docs: `php artisan inertia:start-ssr`),
        | each full page load can block for the HTTP client timeout (often 30–60 seconds).
        */
        'enabled' => (bool) env('INERTIA_SSR_ENABLED', false),
        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
        // 'bundle' => base_path('bootstrap/ssr/ssr.mjs'),

        /*
        | When `public/hot` exists, Inertia SSR uses the Vite dev server. If that
        | server is not running (stale hot file) or the SSR endpoint is not ready,
        | page loads can block for the HTTP client timeout (~20s+). Set to true only
        | when you run Vite with a working `__inertia_ssr` endpoint (see Inertia docs).
        */
        'allow_with_vite_hot' => (bool) env('INERTIA_SSR_WITH_VITE_HOT', false),

    ],

    /*
    |--------------------------------------------------------------------------
    | Testing
    |--------------------------------------------------------------------------
    |
    | The values described here are used to locate Inertia components on the
    | filesystem. For instance, when using `assertInertia`, the assertion
    | attempts to locate the component as a file relative to the paths.
    |
    */

    'testing' => [

        'ensure_pages_exist' => true,

        'page_paths' => [
            resource_path('js/pages'),
        ],

        'page_extensions' => [
            'js',
            'jsx',
            'svelte',
            'ts',
            'tsx',
            'vue',
        ],

    ],

];
