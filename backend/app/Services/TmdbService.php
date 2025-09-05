<?php

namespace App\Services;

use App\Contracts\TmdbRepositoryInterface;
use App\Utils\Result;

class TmdbService
{
    protected $repository;

    public function __construct(TmdbRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get a list of movies that are currently in theaters.
     */
    public function getMovieNowPlaying(int $page = 1): Result
    {
        return $this->repository->getMovieNowPlaying($page);
    }

    /**
     * Get a list of movies that are being released soon.
     */
    public function getMovieUpComing(int $page): Result
    {
        return $this->repository->getMovieUpComing($page);
    }

    /**
     * Get movie videos by movie id.
     */
    public function getMovieVideosById(int $movieId): Result
    {
        return $this->repository->getMovieVideosById($movieId);
    }

    /**
     * Get movie trending.
     * 
     * @param string $type "movie" or "tv".
     * @param int $page for pagination.
     * @param string $window "day" or "week". Defaults to "week".
     */
    public function getTrending(string $type, int $page, string $window = "week"): Result
    {
        return $this->repository->getTrending($type, $page, $window);
    }

    /**
     * Get movie popular.
     */
    public function getMoviePopular(int $page): Result
    {
        return $this->repository->getMoviePopular($page);
    }

    /**
     * Get movie videos Goat.
     */
    public function getMovieGoat(int $page): Result
    {
        return $this->repository->getMovieGoat($page);
    }

    /**
     * Find shows using filters and sort options.
     */
    public function discoverByType($type, $filters, $page): Result
    {
        return $this->repository->discoverByType($type, $filters, $page);
    }

    /**
     * Find shows using filters and sort options.
     */
    public function searchWithParams($type, $filters, $page): Result
    {
        return $this->repository->searchWithParams($type, $filters, $page);
    }
}
