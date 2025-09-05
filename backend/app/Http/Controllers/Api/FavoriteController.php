<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class FavoriteController extends Controller
{
    /**
     * Get user's favorites with optional filtering
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'media_type' => 'nullable|string|in:movie,tv',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:50',
        ]);

        /** @var User $user */
        $user = Auth::user();
        $query = $user->favorites()->latest();

        if ($request->has('media_type')) {
            $query->ofType($request->media_type);
        }

        $perPage = $request->get('per_page', 20);
        $favorites = $query->paginate($perPage);

        return response()->json([
            'favorites' => $favorites->items(),
            'pagination' => [
                'current_page' => $favorites->currentPage(),
                'last_page' => $favorites->lastPage(),
                'per_page' => $favorites->perPage(),
                'total' => $favorites->total(),
            ]
        ]);
    }

    /**
     * Add a media to favorites
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'media_type' => 'required|string|in:movie,tv',
            'media_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'poster_path' => 'nullable|string',
            'release_date' => 'nullable|string',
            'vote_average' => 'nullable|numeric|between:0,10',
            'genre_ids' => 'nullable|array',
            'genre_ids.*' => 'integer',
            'overview' => 'nullable|string',
        ]);

        /** @var User $user */
        $user = Auth::user();
        
        // Check if already in favorites
        $existingFavorite = $user->favorites()
            ->where('media_type', $validated['media_type'])
            ->where('media_id', $validated['media_id'])
            ->first();

        if ($existingFavorite) {
            return response()->json([
                'message' => 'Bu içerik zaten favorilerinizde',
                'favorite' => $existingFavorite
            ], 409);
        }

        $favorite = $user->favorites()->create($validated);

        return response()->json([
            'message' => 'Favorilere eklendi',
            'favorite' => $favorite
        ], 201);
    }

    /**
     * Remove a media from favorites
     */
    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'media_type' => 'required|string|in:movie,tv',
            'media_id' => 'required|integer',
        ]);

        /** @var User $user */
        $user = Auth::user();
        
        $favorite = $user->favorites()
            ->where('media_type', $validated['media_type'])
            ->where('media_id', $validated['media_id'])
            ->first();

        if (!$favorite) {
            return response()->json([
                'message' => 'Bu içerik favorilerinizde bulunamadı'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'message' => 'Favorilerden kaldırıldı'
        ]);
    }

    /**
     * Check if a media is in user's favorites
     */
    public function check(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'media_type' => 'required|string|in:movie,tv',
            'media_id' => 'required|integer',
        ]);

        /** @var User $user */
        $user = Auth::user();
        
        $isFavorite = $user->favorites()
            ->where('media_type', $validated['media_type'])
            ->where('media_id', $validated['media_id'])
            ->exists();

        return response()->json([
            'is_favorite' => $isFavorite
        ]);
    }

    /**
     * Get user's favorite count by media type
     */
    public function count(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        
        $counts = [
            'total' => $user->favorites()->count(),
            'movies' => $user->favorites()->ofType('movie')->count(),
            'tv_shows' => $user->favorites()->ofType('tv')->count(),
        ];

        return response()->json($counts);
    }
}
