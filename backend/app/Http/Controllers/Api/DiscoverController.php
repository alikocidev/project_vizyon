<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TmdbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiscoverController extends Controller
{
    protected $tmdbService;

    public function __construct(TmdbService $tmdbService)
    {
        $this->tmdbService = $tmdbService;
    }

    public function getShows(string $type, Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'nullable|integer|min:1|max:50',
            'show_type' => 'nullable|string',
            'sort_by' => 'nullable|string',
            'primary_release_date_year_max' => 'nullable|integer|min:1900|max:2024',
            'primary_release_date_year_min' => 'nullable|integer|min:1900|max:2024',
            'with_genres' => 'nullable|string',
            'with_original_language' => 'nullable|string',
            'vote_average_max' => 'nullable|numeric|min:0|max:10',
            'vote_average_min' => 'nullable|numeric|min:0|max:10',
        ]);

        $page = $request->query('page', 1);

        $filters = $request->only([
            'show_type',
            'sort_by',
            'primary_release_date_year_max',
            'primary_release_date_year_min',
            'with_genres',
            'with_original_language',
            'vote_average_max',
            'vote_average_min'
        ]);

        $filters = array_merge([
            'show_type' => 'movie',
            'sort_by' => 'popularity.desc',
            'primary_release_date_year_max' => 2024,
            'primary_release_date_year_min' => 1900
        ], array_filter($filters));
        
        $filters['primary_release_date_year_min'] = "{$filters['primary_release_date_year_min']}-01-01";
        $filters['primary_release_date_year_max'] = "{$filters['primary_release_date_year_max']}-12-31";

        $result = $this->tmdbService->discoverByType($type, $filters, $page);

        return $result->isSuccess
            ? response()->json($result->data)
            : response()->json(['error' => $result->error], 500);
    }
}
