<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StreamingAvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlatformController extends Controller
{
    protected $streamingAvailabilityService;

    public function __construct(StreamingAvailabilityService $streamingAvailabilityService)
    {
        $this->streamingAvailabilityService = $streamingAvailabilityService;
    }

    public function getPlatformPopular(string $platform, Request $request): JsonResponse
    {
        $request->validate([
            'cursor' => 'nullable|string',
        ]);
        $cursor = $request->query('cursor');

        $result = $this->streamingAvailabilityService->getPlatformPopularShows($platform, $cursor);
        if ($result->isSuccess) {
            return response()->json($result->data);
        } else {
            return response()->json(['error' => $result->error], 500);
        }
    }
}
