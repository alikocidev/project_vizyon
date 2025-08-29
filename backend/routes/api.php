<?php

use App\Http\Controllers\Api\DiscoverController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\PlatformController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SeriesController;
use App\Http\Controllers\Api\TrendingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', function () {
        return response()->json(['message' => 'Register endpoint - implement with Sanctum']);
    });
    Route::post('/login', function () {
        return response()->json(['message' => 'Login endpoint - implement with Sanctum']);
    });
    Route::post('/logout', function () {
        return response()->json(['message' => 'Logout endpoint - implement with Sanctum']);
    })->middleware('auth:sanctum');
});

// Public Movie Routes
Route::prefix('movie')->group(function () {
    Route::get('/theaters', [MovieController::class, 'getTheaters']);
    Route::get('/upcomings', [MovieController::class, 'getUpComings']);
    Route::get('/popular', [MovieController::class, 'getPopular']);
    Route::get('/goat', [MovieController::class, 'getGoat']);
    Route::get('/{movie}/videos', [MovieController::class, 'getVideosByMovieId']);
});

// Home Page Data
Route::get('/home', [\App\Http\Controllers\HomeController::class, 'index']);

Route::prefix('trending')->group(function () {
    Route::get('/{type}/{window}', [TrendingController::class, 'getTrending']);
});

Route::prefix('series')->group(function () {
    Route::get('/upcomings', [SeriesController::class, 'getUpComings']);
});

Route::prefix('platform')->group(function () {
    Route::get('/{platform}/popular', [PlatformController::class, 'getPlatformPopular']);
});

Route::prefix('discover')->group(function () {
    Route::get('/{type}', [DiscoverController::class, 'getShows']);
});

Route::prefix('search')->group(function () {
    Route::get('/{type}', [SearchController::class, 'getShows']);
});

// Protected Routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });
    
    // Profile Routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [\App\Http\Controllers\ProfileController::class, 'show']);
        Route::put('/', [\App\Http\Controllers\ProfileController::class, 'update']);
        Route::delete('/', [\App\Http\Controllers\ProfileController::class, 'destroy']);
    });
    
    // Add other protected routes here
});
