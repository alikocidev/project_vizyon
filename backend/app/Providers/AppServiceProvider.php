<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // TMDB Repository binding
        $this->app->bind(
            \App\Contracts\TmdbRepositoryInterface::class,
            function ($app) {
                if (config('services.tmdb.fake_mode', false)) {
                    return new \App\Repositories\TmdbFakeRepository();
                }
                return new \App\Repositories\TmdbApiRepository();
            }
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
