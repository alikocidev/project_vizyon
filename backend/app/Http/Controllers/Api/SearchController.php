<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TmdbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
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
            'query' => 'required|string',
        ]);

        $page = $request->query('page', 1);

        $filters = $request->only([
            'query',
        ]);

        $filters = array_merge([], array_filter($filters));

        $result = $this->tmdbService->searchWithParams($type, $filters, $page);

        return $result->isSuccess
            ? response()->json($result->data)
            : response()->json(['error' => $result->error], 500);
    }
}
