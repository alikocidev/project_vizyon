<?php

namespace App\Repositories;

use App\Contracts\TmdbRepositoryInterface;
use App\Utils\Result;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TmdbApiRepository implements TmdbRepositoryInterface
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

    public function getMovieNowPlaying($page = 1): Result
    {
        $cacheKey = "tmdb:movies:now_playing:page:{$page}";
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

    public function getMovieUpComing($page = 1): Result
    {
        $cacheKey = "tmdb:movies:upcoming:page:{$page}";
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

    public function getMovieVideosById($movieId): Result
    {
        $cacheKey = "tmdb:movies:{$movieId}:videos";
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

    public function getTrending($type, $page = 1, $window = 'week'): Result
    {
        $cacheKey = "tmdb:trending:{$type}:{$window}:page:{$page}";
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

    public function getMoviePopular($page = 1): Result
    {
        $cacheKey = "tmdb:movies:popular:page:{$page}";
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

    public function getMovieGoat($page = 1): Result
    {
        $cacheKey = "tmdb:movies:top_rated:page:{$page}";
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

    public function discoverByType($type, $filters, $page = 1): Result
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
            $cacheKey = "tmdb:discover:{$type}:filters:{$serialize_query}";
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

    public function searchWithParams($type, $filters, $page = 1): Result
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
            $cacheKey = "tmdb:search:{$type}:query:{$serialize_query}";
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

    protected function onBeforeMovieNowPlaying($page): bool
    {
        $cacheKey = "tmdb:movies:now_playing:metadata";
        $value = Cache::get($cacheKey);
        return !$value || ($value['total_pages'] && intval($value['total_pages']) >= $page);
    }

    protected function onFetchingMovieNowPlaying($response): bool
    {
        $cacheKey = "tmdb:movies:now_playing:metadata";
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

    protected function onBeforeMovieUpComing($page): bool
    {
        $cacheKey = "tmdb:movies:upcoming:metadata";
        $value = Cache::get($cacheKey);
        return !$value || ($value['total_pages'] && intval($value['total_pages']) >= $page);
    }

    protected function onFetchingMovieUpComing($response): bool
    {
        $cacheKey = "tmdb:movies:upcoming:metadata";
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
}