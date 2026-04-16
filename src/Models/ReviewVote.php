<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewVote extends Model
{
    use HasFactory;

    protected $fillable = [
        'review_id',
        'user_id',
        'vote_type',
    ];

    /**
     * Get the review that owns the vote.
     */
    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class);
    }

    /**
     * Get the user that cast the vote.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include votes for a specific review.
     */
    public function scopeForReview(Builder $query, int $reviewId): void
    {
        $query->where('review_id', $reviewId);
    }

    /**
     * Scope a query to only include votes by a specific user.
     */
    public function scopeByUser(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }
}
