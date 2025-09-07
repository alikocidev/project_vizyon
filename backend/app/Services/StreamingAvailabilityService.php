<?php

namespace App\Services;

use App\Utils\Result;
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
        $cursorHash = $cursor ? md5($cursor) : 'first_page';
        $cacheKey = "streaming:platform:{$platformName}:popular:cursor:{$cursorHash}";

        $ttlMinutes = 360;

        $cachedData = Cache::remember($cacheKey, $ttlMinutes, function () use ($platformName, $cursor) {
            Log::channel("rapidapi")->info("Cache miss for key: {$platformName} with cursor: " . ($cursor ?? 'null'));

            try {
                $queryParams = [
                    'country' => 'tr',
                    'series_granularity' => 'show',
                    'order_direction' => 'desc',
                    'order_by' => 'popularity_1month',
                    'output_language' => 'tr',
                    'catalogs' => $platformName
                ];

                if ($cursor) {
                    $queryParams['cursor'] = $cursor;
                }

                $response = $this->client->get("shows/search/filters", [
                    'query' => $queryParams,
                    'timeout' => 10,
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

        if (!isset($cachedData['shows']) || !is_array($cachedData['shows'])) {
            Log::channel("rapidapi")->warning("Invalid data structure received from API", [
                'platform' => $platformName,
                'data_keys' => array_keys($cachedData ?? [])
            ]);
            return Result::failure('Invalid data structure from API');
        }

        $filteredShows = $this->filterShowData($cachedData['shows']);

        $result = [
            'name' => $platformName,
            'shows' => $filteredShows,
            'hasMore' => $cachedData['hasMore'] ?? false,
            'nextCursor' => $cachedData['nextCursor'] ?? null,
        ];

        return Result::success($result);
    }

    /**
     * Veri boyutunu azaltmak için sadece frontend'de kullanılan alanları filtrele
     */
    private function filterShowData(array $shows): array
    {
        return array_map(function ($show) {
            return [
                'title' => $show['title'] ?? null,
                'originalTitle' => $show['originalTitle'] ?? null,
                'imageSet' => $this->filterImageSet($show['imageSet'] ?? []),
            ];
        }, $shows);
    }

    /**
     * Resim setini filtrele - sadece frontend'de kullanılan horizontalPoster boyutları
     */
    private function filterImageSet(array $imageSet): array
    {
        $filtered = [];

        // Sadece horizontal poster - frontend'de kullanılan boyutlar
        if (isset($imageSet['horizontalPoster'])) {
            $horizontalPoster = $imageSet['horizontalPoster'];
            $filtered['horizontalPoster'] = [];

            // Frontend'de kullanılan boyutları sıraya göre ekle
            $sizes = ['w720', 'w600', 'w480', 'w360', 'w240'];
            foreach ($sizes as $size) {
                if (isset($horizontalPoster[$size])) {
                    $filtered['horizontalPoster'][$size] = $horizontalPoster[$size];
                }
            }
        }

        return $filtered;
    }
}
