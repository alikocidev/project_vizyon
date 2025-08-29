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
    public function getPlatformPopularShows(string $platformName, ?string $cursor = null): Result
    {
        // Cursor'un hash'ini alarak cache key'i daha stabil hale getiriyoruz
        $cursorHash = $cursor ? md5($cursor) : 'default';
        $cacheKey = "platform_popular_{$platformName}_{$cursorHash}";

        // TTL'yi sabit olarak tanımlayarak performansı artırıyoruz (6 saat)
        $ttlMinutes = 360;

        $cachedData = Cache::remember($cacheKey, $ttlMinutes, function () use ($platformName, $cursor) {
            try {
                $queryParams = [
                    'country' => 'tr',
                    'series_granularity' => 'show',
                    'order_direction' => 'desc',
                    'order_by' => 'popularity_1month',
                    'output_language' => 'tr',
                    'catalogs' => $platformName
                ];

                // Cursor varsa ekle
                if ($cursor) {
                    $queryParams['cursor'] = $cursor;
                }

                $response = $this->client->get("shows/search/filters", [
                    'query' => $queryParams,
                    'timeout' => 10, // Timeout ekleyerek yavaş API çağrılarını önlüyoruz
                ]);

                if ($response->getStatusCode() !== 200) {
                    Log::channel("rapidapi")->error("Error fetching data from RapidApi Service 'shows/search/filters'", [
                        'status_code' => $response->getStatusCode(),
                        'platform' => $platformName
                    ]);
                    return null;
                }

                Log::channel("rapidapi")->info("Fetching data from RapidApi Service 'shows/search/filters'", [
                    'platform' => $platformName,
                    'has_cursor' => !is_null($cursor)
                ]);

                $data = json_decode($response->getBody()->getContents(), true);

                // JSON decode hatası kontrolü
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::channel("rapidapi")->error("JSON decode error: " . json_last_error_msg());
                    return null;
                }

                return $data;
            } catch (\Exception $e) {
                Log::channel("rapidapi")->error("Exception occurred in getPlatformPopularShows", [
                    'message' => $e->getMessage(),
                    'platform' => $platformName,
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]);
                return null;
            }
        });

        if ($cachedData === null) {
            return Result::failure('Error fetching data from RapidApi');
        }

        // Data validation
        if (!isset($cachedData['shows']) || !is_array($cachedData['shows'])) {
            Log::channel("rapidapi")->warning("Invalid data structure received from API", [
                'platform' => $platformName,
                'data_keys' => array_keys($cachedData ?? [])
            ]);
            return Result::failure('Invalid data structure from API');
        }

        $result = [
            'name' => $platformName,
            'shows' => $cachedData['shows'],
            'hasMore' => $cachedData['hasMore'] ?? false,
            'nextCursor' => $cachedData['nextCursor'] ?? null,
        ];

        return Result::success($result);
    }
}
