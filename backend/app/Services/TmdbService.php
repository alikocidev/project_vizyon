<?php

namespace App\Services;

use App\Utils\Result;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TmdbService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config("services.tmdb.base_uri"),
            'headers' => [
                'Authorization' => 'Bearer' . ' ' . config("services.tmdb.access_key"),
                'accept' => 'application/json',
            ],
        ]);
    }

    /**
     * Get a list of movies that are currently in theaters.
     */
    public function getMovieNowPlaying(int $page = 1): Result
    {

        $cacheKey = "now_playing_movies_page_{$page}";
        $ttl = Carbon::now()->diffInSeconds(Carbon::tomorrow());
        $cachedData = null;
        if (!$this->onBeforeMovieNowPlaying($page)) {
            $cachedData = [];
        } else {
            $cachedData = Cache::remember($cacheKey, $ttl, function () use ($page) {
                try {
                    $queryParams = [
                        'page' => $page,
                        'language' => 'tr',
                        'region' => 'tr',
                    ];
                    $response = $this->client->get('movie/now_playing', [
                        'query' => $queryParams
                    ]);

                    if ($response->getStatusCode() !== 200) {
                        Log::channel("tmdb")->error("Error fetching data from TMDB Service 'movie/now_playing'", $queryParams);
                        return null;
                    }
                    Log::channel("tmdb")->info("Fetching data from TMDB Service 'movie/now_playing'", $queryParams);
                    $data = json_decode($response->getBody()->getContents(), true);
                    $this->onFetchingMovieNowPlaying($data);
                    return $data['results'];
                } catch (\Exception $e) {
                    Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
                    return null;
                }
            });
        }

        if ($cachedData === null) {
            return Result::failure('Error fetching data from TMDB');
        }

        return Result::success($cachedData);
    }
    protected function onBeforeMovieNowPlaying($page): bool
    {
        $cacheKey = "now_playing_movies_detail";
        $value = Cache::get($cacheKey);
        return !$value || ($value['total_pages'] && intval($value['total_pages']) >= $page);
    }
    protected function onFetchingMovieNowPlaying($response): bool
    {
        $cacheKey = "now_playing_movies_detail";
        if (Cache::has($cacheKey)) {
            return true;
        }

        $ttl = Carbon::now()->diffInSeconds(Carbon::tomorrow());

        if (isset($response['results'])) {
            unset($response['results']);
        }
        if (isset($response['page'])) {
            unset($response['page']);
        }
        return Cache::put($cacheKey, $response, $ttl);
    }

    /**
     * Get a list of movies that are being released soon.
     */
    public function getMovieUpComing(int $page): Result
    {
        $cacheKey = "upcoming_movies_page_{$page}";
        $ttl = Carbon::now()->diffInSeconds(Carbon::tomorrow());

        $cachedData = null;
        if (!$this->onBeforeMovieUpComing($page)) {
            $cachedData = [];
        } else {
            $cachedData = Cache::remember($cacheKey, $ttl, function () use ($page) {
                try {
                    $queryParams = [
                        'page' => $page,
                        'language' => 'tr',
                        'region' => 'tr',
                    ];
                    $response = $this->client->get('movie/upcoming', [
                        'query' => $queryParams,
                    ]);

                    if ($response->getStatusCode() !== 200) {
                        Log::channel("tmdb")->error("Error fetching data from TMDB Service 'movie/upcoming'", $queryParams);
                        return null;
                    }
                    Log::channel("tmdb")->info("Fetching data from TMDB Service 'movie/upcoming'", $queryParams);
                    $data = json_decode($response->getBody()->getContents(), true);
                    $this->onFetchingMovieUpComing($data);
                    return $data['results'];
                } catch (\Exception $e) {
                    Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
                    return null;
                }
            });
        }

        if ($cachedData === null) {
            return Result::failure('Error fetching data from TMDB');
        }

        return Result::success($cachedData);
    }
    protected function onBeforeMovieUpComing($page): bool
    {
        $cacheKey = "upcoming_movies_detail";
        $value = Cache::get($cacheKey);
        return !$value || ($value['total_pages'] && intval($value['total_pages']) >= $page);
    }
    protected function onFetchingMovieUpComing($response): bool
    {
        $cacheKey = "upcoming_movies_detail";
        if (Cache::has($cacheKey)) {
            return true;
        }

        $ttl = Carbon::now()->diffInSeconds(Carbon::tomorrow());

        if (isset($response['results'])) {
            unset($response['results']);
        }
        if (isset($response['page'])) {
            unset($response['page']);
        }
        return Cache::put($cacheKey, $response, $ttl);
    }

    /**
     * Get movie videos by movie id.
     */
    public function getMovieVideosById(int $movieId): Result
    {
        $cacheKey = "movie_{$movieId}_videos";
        $ttl = Carbon::now()->diffInSeconds(Carbon::tomorrow());

        $cachedData = Cache::remember($cacheKey, $ttl, function () use ($movieId) {
            try {
                $queryParams = [
                    'language' => 'tr',
                ];
                $response = $this->client->get("movie/{$movieId}/videos", [
                    'query' => $queryParams,
                ]);

                if ($response->getStatusCode() !== 200) {
                    Log::channel("tmdb")->error("Error fetching data from TMDB Service 'movie/{$movieId}/videos'");
                    return null;
                }
                Log::channel("tmdb")->info("Fetching data from TMDB Service 'movie/{$movieId}/videos'", $queryParams);
                $data = json_decode($response->getBody()->getContents(), true);
                return $data['results'];
            } catch (\Exception $e) {
                Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
                return null;
            }
        });

        if ($cachedData === null) {
            return Result::failure('Error fetching data from TMDB');
        }

        return Result::success($cachedData);
    }

    /**
     * Get movie trending.
     * 
     * @param string $type "movie" or "tv".
     * @param int $page for pagination.
     * @param string $window "day" or "week". Defaults to "week".
     */
    public function getTrending(string $type, string $window = "week", int $page): Result
    {
        $cacheKey = "trending_{$type}_{$window}_{$page}";
        $ttl = Carbon::now()->diffInSeconds(Carbon::tomorrow());
        $cachedData = null;

        $cachedData = Cache::remember($cacheKey, $ttl, function () use ($type, $window, $page) {
            try {
                $queryParams = [
                    'page' => $page,
                    'language' => 'tr',
                ];
                $response = $this->client->get("trending/{$type}/{$window}", [
                    'query' => $queryParams,
                ]);

                if ($response->getStatusCode() !== 200) {
                    Log::channel("tmdb")->error("Error fetching data from TMDB Service 'trending/movie/{$window}'");
                    return null;
                }
                Log::channel("tmdb")->info("Fetching data from TMDB Service 'trending/movie/{$window}'", $queryParams);
                $data = json_decode($response->getBody()->getContents(), true);
                return $data['results'];
            } catch (\Exception $e) {
                Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
                return null;
            }
        });

        if ($cachedData === null) {
            return Result::failure('Error fetching data from TMDB');
        }

        return Result::success($cachedData);
    }

    /**
     * Get movie popular.
     */
    public function getMoviePopular(int $page): Result
    {
        $cacheKey = "popular_movies_{$page}";
        $ttl = Carbon::now()->diffInSeconds(Carbon::tomorrow());
        $cachedData = null;

        $cachedData = Cache::remember($cacheKey, $ttl, function () use ($page) {
            try {
                $queryParams = [
                    'page' => $page,
                    'language' => 'tr',
                    'region' => 'tr'
                ];
                $response = $this->client->get("movie/popular", [
                    'query' => $queryParams,
                ]);

                if ($response->getStatusCode() !== 200) {
                    Log::channel("tmdb")->error("Error fetching data from TMDB Service 'movie/popular'");
                    return null;
                }
                Log::channel("tmdb")->info("Fetching data from TMDB Service 'movie/popular'", $queryParams);
                $data = json_decode($response->getBody()->getContents(), true);
                return $data['results'];
            } catch (\Exception $e) {
                Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
                return null;
            }
        });

        if ($cachedData === null) {
            return Result::failure('Error fetching data from TMDB');
        }

        return Result::success($cachedData);
    }

    /**
     * Get movie videos Goat.
     */
    public function getMovieGoat(int $page): Result
    {
        $cacheKey = "goat_movies_{$page}";
        $cachedData = null;
        $ttl = Carbon::now()->addMonth();

        $cachedData = Cache::remember($cacheKey, $ttl, function () use ($page) {
            try {
                $queryParams = [
                    'page' => $page,
                    'language' => 'tr',
                    'region' => 'tr'
                ];
                $response = $this->client->get("movie/top_rated", [
                    'query' => $queryParams,
                ]);

                if ($response->getStatusCode() !== 200) {
                    Log::channel("tmdb")->error("Error fetching data from TMDB Service 'movie/top_rated'");
                    return null;
                }
                Log::channel("tmdb")->info("Fetching data from TMDB Service 'movie/top_rated'", $queryParams);
                $data = json_decode($response->getBody()->getContents(), true);
                return $data['results'];
            } catch (\Exception $e) {
                Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
                return null;
            }
        });

        if ($cachedData === null) {
            return Result::failure('Error fetching data from TMDB');
        }

        return Result::success($cachedData);
    }

    /**
     * Find shows using filters and sort options.
     */
    public function discoverByType($type, $filters, $page): Result
    {
        try {
            $queryParams = array_filter([
                'page' => $page,
                'language' => 'tr',
                'region' => 'tr',
                'sort_by' => $filters['sort_by'] ?? null,
                'primary_release_date.gte' => $filters['primary_release_date_year_min'] ?? null,
                'primary_release_date.lte' => $filters['primary_release_date_year_max'] ?? null,
                'with_genres' => $filters['with_genres'] ?? null,
                'with_original_language' => $filters['with_original_language'] ?? null,
                'vote_average.gte' => $filters['vote_average_min'] ?? null,
                'vote_average.lte' => $filters['vote_average_max'] ?? null,
            ]);
            $serialize_query = md5(serialize($queryParams));
            $cacheKey = "discover_{$type}_filter={$serialize_query}";
            $ttl = Carbon::now()->addDay();

            $cachedData = Cache::remember($cacheKey, $ttl, function () use ($type, $queryParams) {
                try {
                    $response = $this->client->get("discover/{$type}", [
                        'query' => $queryParams,
                    ]);

                    if ($response->getStatusCode() !== 200) {
                        Log::channel("tmdb")->error("Error fetching data from TMDB Service 'discover/{$type}', status code: " . $response->getStatusCode());
                        return null;
                    }
                    Log::channel("tmdb")->info("Fetching data from TMDB Service 'discover/{$type}'", $queryParams);
                    $data = json_decode($response->getBody()->getContents(), true);
                    return $data['results'];
                } catch (\Exception $e) {
                    Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
                    return null;
                }
            });

            if ($cachedData === null) {
                return Result::failure('Error fetching data from TMDB');
            }
            return Result::success($cachedData);
        } catch (\Exception $e) {
            Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
            return Result::failure('Exception occurred: ' . $e->getMessage());
        }
    }

    /**
     * Find shows using filters and sort options.
     */
    public function searchWithParams($type, $filters, $page): Result
    {
        try {
            $queryParams = array_filter([
                'query' => $filters['query'] ?? null,
                'page' => $page,
                'language' => 'tr',
                'region' => 'tr',
                'primary_release_year' => $filters['year'] ?? null,
                'first_air_date_year' => $filters['year'] ?? null,
            ]);
            $serialize_query = md5(serialize($queryParams));
            $cacheKey = "search_{$type}_query={$serialize_query}";
            $ttl = Carbon::now()->addDay();

            $cachedData = Cache::remember($cacheKey, $ttl, function () use ($type, $queryParams) {
                try {
                    $response = $this->client->get("search/{$type}", [
                        'query' => $queryParams,
                    ]);

                    if ($response->getStatusCode() !== 200) {
                        Log::channel("tmdb")->error("Error fetching data from TMDB Service 'search/{$type}', status code: " . $response->getStatusCode());
                        return null;
                    }
                    Log::channel("tmdb")->info("Fetching data from TMDB Service 'search/{$type}'", $queryParams);
                    $data = json_decode($response->getBody()->getContents(), true);
                    return $data['results'];
                } catch (\Exception $e) {
                    Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
                    return null;
                }
            });

            if ($cachedData === null) {
                return Result::failure('Error fetching data from TMDB');
            }
            return Result::success($cachedData);
        } catch (\Exception $e) {
            Log::channel("tmdb")->error("Exception occurred: {$e->getMessage()}");
            return Result::failure('Exception occurred: ' . $e->getMessage());
        }
    }
}
