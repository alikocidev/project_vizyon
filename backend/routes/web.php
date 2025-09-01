<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

// API Backend Info Page
Route::get('/', function () {
    return view('app');
})->name('api.info');

// Login route for API authentication middleware redirect
Route::get('/login', function () {
    return response()->json([
        'message' => 'Authentication required',
        'error' => 'Please authenticate using the API endpoints',
        'login_endpoint' => url('/api/auth/login'),
        'register_endpoint' => url('/api/auth/register')
    ], 401);
})->name('login');

// API Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
})->name('api.health');

// Redirect any other routes to frontend
Route::fallback(function () {
    return response()->json([
        'message' => 'Route not found. This is an API backend.',
        'frontend_url' => config('app.frontend_url', 'http://localhost:3000'),
        'api_docs' => url('/api/documentation')
    ], 404);
});
