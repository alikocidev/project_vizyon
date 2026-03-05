<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['v1/*'],

    'allowed_methods' => ['*'],

    // Comma-separated list from env keeps deploy environments configurable.
    // FRONTEND_URL is also appended to avoid accidental CORS lockouts.
    'allowed_origins' => array_values(array_unique(array_filter(array_map(
        static fn (string $origin) => trim($origin),
        array_merge(
            explode(',', (string) env(
                'CORS_ALLOWED_ORIGINS',
                'http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,https://projectvizyon.alikoc.dev,https://www.projectvizyon.alikoc.dev'
            )),
            [(string) env('FRONTEND_URL', '')]
        )
    )))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
