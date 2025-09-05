<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'media_type',
        'media_id',
        'title',
        'poster_path',
        'release_date',
        'vote_average',
        'genre_ids',
        'overview',
    ];

    protected $casts = [
        'genre_ids' => 'array',
        'vote_average' => 'decimal:1',
    ];

    /**
     * Get the user that owns the favorite.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter by media type.
     */
    public function scopeOfType($query, string $mediaType)
    {
        return $query->where('media_type', $mediaType);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
