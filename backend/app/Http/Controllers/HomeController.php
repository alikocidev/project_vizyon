<?php

namespace App\Http\Controllers;

use App\Services\StreamingAvailabilityService;
use App\Services\TmdbService;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    protected $tmdbService;
    protected $streamingAvailabilityService;

    public function __construct(TmdbService $tmdbService, StreamingAvailabilityService $streamingAvailabilityService)
    {
        $this->tmdbService = $tmdbService;
        $this->streamingAvailabilityService = $streamingAvailabilityService;
    }

    public function index(): JsonResponse
    {
        $theaters = $this->tmdbService->getMovieNowPlaying(1);
        $upComings = $this->tmdbService->getMovieUpComing(1);
        $platform = $this->streamingAvailabilityService->getPlatformPopularShows("prime");

        $theatersData = $theaters->isSuccess ? $theaters->data : [];
        $upComingsData = $upComings->isSuccess ? $upComings->data : [];
        $platformData = $platform->isSuccess ? $platform->data : [];

        return response()->json([
            'theaters' => $theatersData,
            'upComings' => $upComingsData,
            'platform' => $platformData,
        ]);
    }
}
