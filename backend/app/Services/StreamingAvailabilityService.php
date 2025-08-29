<?php

namespace App\Services;

use App\Utils\Result;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class StreamingAvailabilityService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config("services.streamingAvailability.base_uri"),
            'headers' => [
                'X-RapidAPI-Host' => config("services.streamingAvailability.host"),
                'X-RapidAPI-Key' => config("services.streamingAvailability.api_key"),
            ],
        ]);
    }

    /**
     * Get platform popular shows.
     */
    public function getPlatformPopularShows(string $platformName, string $cursor = null): Result
    {
        $cacheKey = "platform_{$platformName}_{$cursor}";
        $cachedData = null;
        $ttl = Carbon::now()->addMonth();

        $cachedData = Cache::remember($cacheKey, $ttl, function () use ($platformName, $cursor) {
            try {
                $queryParams = [
                    'cursor' => $cursor,
                    'country' => 'tr',
                    'series_granularity' => 'show',
                    'order_direction' => 'desc',
                    'order_by' => 'popularity_1month',
                    'output_language' => 'tr',
                    'catalogs' => $platformName
                ];
                $response = $this->client->get("shows/search/filters", [
                    'query' => $queryParams,
                ]);

                if ($response->getStatusCode() !== 200) {
                    Log::channel("rapidapi")->error("Error fetching data from RapidApi Service 'shows/search/filters'");
                    return null;
                }
                Log::channel("rapidapi")->info("Fetching data from RapidApi Service 'shows/search/filters'", $queryParams);
                $data = json_decode($response->getBody()->getContents(), true);
                return $data;
            } catch (\Exception $e) {
                Log::channel("rapidapi")->error("Exception occurred: {$e->getMessage()}");
                return null;
            }
        });

        if ($cachedData === null) {
            return Result::failure('Error fetching data from RapidApi');
        }

        $result = [
            'name' => $platformName,
            'shows' => $cachedData['shows'],
            'hasMore' => $cachedData['hasMore'],
            'nextCursor' => $cachedData['nextCursor'],
        ];

        return Result::success($result);
    }
}
