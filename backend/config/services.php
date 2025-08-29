<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /**
     * Custom Services
     */

    'tmdb' => [
        'api_key' => env('TMDB_API_KEY'),
        'access_key' => env('TMDB_ACCESS_KEY'),
        'base_uri' => env('TMDB_BASE_URI', 'https://api.themoviedb.org/3/'),
    ],

    'streamingAvailability' => [
        'api_key' => env('STREAMING_AVAILABILITY_API_KEY'),
        'host' => env('STREAMING_AVAILABILITY_HOST', "streaming-availability.p.rapidapi.com"),
        'base_uri' => env('STREAMING_AVAILABILITY_BASE_URI', 'https://streaming-availability.p.rapidapi.com'),
    ],
];
