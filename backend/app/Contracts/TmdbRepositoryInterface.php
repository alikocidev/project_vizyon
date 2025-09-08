<?php

namespace App\Contracts;

interface TmdbRepositoryInterface
{
    public function getMovieNowPlaying($page = 1);
    public function getMovieUpComing($page = 1);
    public function getMovieVideosById($movieId);
    public function getMovieDetail($movieId);
    public function getTrending($type, $window, $page = 1);
    public function getMoviePopular($page = 1);
    public function getMovieGoat($page = 1);
    public function discoverByType($type, $filter, $page = 1);
    public function searchWithParams($type, $filter, $page = 1);
}
