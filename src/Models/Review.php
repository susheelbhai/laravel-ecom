<?php

namespace App\Models;

use App\Models\BaseModels\BaseExternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Review extends BaseExternalMediaModel
{
    use HasDynamicMediaAttributes, HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
        'title',
        'content',
        'status',
        'helpful_count',
        'not_helpful_count',
    ];

    protected $attributes = [
        'status' => 'pending',
        'helpful_count' => 0,
        'not_helpful_count' => 0,
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'helpful_count' => 'integer',
            'not_helpful_count' => 'integer',
        ];
    }

    /**
     * Register media collections for review images and videos.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

        $this->addMediaCollection('videos')
            ->acceptsMimeTypes(['video/mp4', 'video/mpeg']);
    }

    /**
     * Get the product that owns the review.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user that wrote the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the votes for the review.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(ReviewVote::class);
    }

    /**
     * Scope a query to only include approved reviews.
     */
    public function scopeApproved(Builder $query): void
    {
        $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include reviews for a specific product.
     */
    public function scopeForProduct(Builder $query, int $productId): void
    {
        $query->where('product_id', $productId);
    }

    /**
     * Check if the review is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the review can be edited by the given user.
     */
    public function canBeEditedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }
}
