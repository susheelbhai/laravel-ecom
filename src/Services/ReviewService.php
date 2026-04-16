<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ReviewService
{
    public function __construct(
        private VerifiedPurchaseService $purchaseService,
        private ReviewCacheService $cacheService
    ) {}

    /**
     * Create a new review with validation.
     */
    public function createReview(User $user, Product $product, array $data): Review
    {
        // Verify purchase
        if (! $this->purchaseService->canReview($user, $product)) {
            throw new \Exception('You can only review products you have purchased');
        }

        // Validate rating
        if (! isset($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
            throw new \Exception('Rating must be between 1 and 5 stars');
        }

        // Validate content
        if (! isset($data['content']) || trim($data['content']) === '') {
            throw new \Exception('Review content is required');
        }

        // Create review
        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $data['rating'],
            'title' => $data['title'] ?? null,
            'content' => $data['content'],
            'status' => 'pending',
        ]);

        return $review;
    }

    /**
     * Update an existing review.
     */
    /**
     * Update an existing review.
     */
    public function updateReview(Review $review, array $data): Review
    {
        // Validate rating if provided
        if (isset($data['rating']) && ($data['rating'] < 1 || $data['rating'] > 5)) {
            throw new \Exception('Rating must be between 1 and 5 stars');
        }

        // Validate content if provided
        if (isset($data['content']) && trim($data['content']) === '') {
            throw new \Exception('Review content cannot be empty');
        }

        // Update review
        $review->update([
            'rating' => $data['rating'] ?? $review->rating,
            'title' => $data['title'] ?? $review->title,
            'content' => $data['content'] ?? $review->content,
        ]);

        // Handle media deletion
        if (isset($data['deleted_media_ids']) && is_array($data['deleted_media_ids'])) {
            $this->deleteMedia($review, $data['deleted_media_ids']);
        }

        return $review->fresh();
    }

    /**
     * Delete a review and invalidate cache.
     */
    public function deleteReview(Review $review): bool
    {
        $product = $review->product;

        DB::transaction(function () use ($review) {
            $review->delete();
        });

        // Invalidate cache
        $this->cacheService->invalidateProductCache($product);

        return true;
    }

    /**
     * Attach media to a review.
     */
    public function attachMedia(Review $review, array $files): void
    {
        if (isset($files['images']) && is_array($files['images'])) {
            foreach ($files['images'] as $image) {
                $review->addMedia($image)->toMediaCollection('images');
            }
        }

        if (isset($files['videos']) && is_array($files['videos'])) {
            foreach ($files['videos'] as $video) {
                $review->addMedia($video)->toMediaCollection('videos');
            }
        }
    }

    /**
     * Delete specific media items from a review.
     */
    public function deleteMedia(Review $review, array $mediaIds): void
    {
        foreach ($mediaIds as $mediaId) {
            $media = $review->media()->find($mediaId);
            if ($media) {
                $media->delete();
            }
        }
    }

    /**
     * Get paginated reviews for a product.
     */
    public function getProductReviews(
        Product $product,
        string $sortBy = 'recent',
        int $perPage = 10,
        ?int $ratingFilter = null
    ): LengthAwarePaginator {
        $query = Review::query()
            ->where('product_id', $product->id)
            ->where('status', 'approved')
            ->with(['user', 'media']);

        // Apply rating filter
        if ($ratingFilter !== null && $ratingFilter >= 1 && $ratingFilter <= 5) {
            $query->where('rating', $ratingFilter);
        }

        // Apply sorting
        match ($sortBy) {
            'highest' => $query->orderBy('rating', 'desc'),
            'lowest' => $query->orderBy('rating', 'asc'),
            'helpful' => $this->applySortByWilsonScore($query),
            default => $query->orderBy('created_at', 'desc'),
        };

        return $query->paginate($perPage);
    }

    /**
     * Apply Wilson Score sorting to the query.
     *
     * Wilson Score provides a statistically sound confidence interval for the true
     * proportion of positive ratings. It balances positive/negative votes while
     * accounting for sample size, preventing items with few votes from ranking too high.
     *
     * Formula: Lower bound of Wilson score confidence interval for a Bernoulli parameter
     * Used by Reddit, Yelp, and other major platforms for ranking.
     */
    private function applySortByWilsonScore($query)
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            // SQLite doesn't have SQRT, use simpler net score approach for tests
            $query->selectRaw('
                reviews.*,
                (helpful_count - not_helpful_count) as wilson_score
            ')
                ->orderBy('wilson_score', 'desc');
        } else {
            // Wilson Score formula for 95% confidence (z = 1.96)
            // score = (p + z²/2n - z * sqrt(p(1-p)/n + z²/4n²)) / (1 + z²/n)
            // where: p = positive ratio, n = total votes, z = 1.96 (95% confidence)

            $query->selectRaw('
                reviews.*,
                CASE 
                    WHEN (helpful_count + not_helpful_count) = 0 THEN 0
                    ELSE (
                        (helpful_count + 1.9208) / (helpful_count + not_helpful_count) - 
                        1.96 * SQRT((helpful_count * not_helpful_count) / (helpful_count + not_helpful_count) + 0.9604) / 
                        (helpful_count + not_helpful_count)
                    ) / (1 + 3.8416 / (helpful_count + not_helpful_count))
                END as wilson_score
            ')
                ->orderBy('wilson_score', 'desc');
        }

        return $query;
    }
}
