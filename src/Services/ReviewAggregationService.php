<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;

class ReviewAggregationService
{
    /**
     * Calculate average rating for a product.
     */
    public function calculateAverageRating(Product $product): float
    {
        return Review::query()
            ->where('product_id', $product->id)
            ->where('status', 'approved')
            ->avg('rating') ?? 0.0;
    }

    /**
     * Get review count for a product.
     */
    public function getReviewCount(Product $product): int
    {
        return Review::query()
            ->where('product_id', $product->id)
            ->where('status', 'approved')
            ->count();
    }

    /**
     * Get rating distribution (1-5 stars).
     */
    public function getRatingDistribution(Product $product): array
    {
        $distribution = Review::query()
            ->where('product_id', $product->id)
            ->where('status', 'approved')
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        // Ensure all ratings 1-5 are present with 0 count if missing
        return [
            1 => $distribution[1] ?? 0,
            2 => $distribution[2] ?? 0,
            3 => $distribution[3] ?? 0,
            4 => $distribution[4] ?? 0,
            5 => $distribution[5] ?? 0,
        ];
    }
}
