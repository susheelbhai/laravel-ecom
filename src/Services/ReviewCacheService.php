<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ReviewCacheService
{
    /**
     * Cache TTL in seconds (1 hour).
     */
    private const CACHE_TTL = 3600;

    /**
     * Get cached average rating.
     */
    public function getAverageRating(Product $product): ?float
    {
        return Cache::get($this->getCacheKey($product));
    }

    /**
     * Cache average rating.
     */
    public function cacheAverageRating(Product $product, float $rating): void
    {
        Cache::put($this->getCacheKey($product), $rating, self::CACHE_TTL);
    }

    /**
     * Invalidate product rating cache.
     */
    public function invalidateProductCache(Product $product): void
    {
        Cache::forget($this->getCacheKey($product));
    }

    /**
     * Get cache key for product rating.
     */
    private function getCacheKey(Product $product): string
    {
        return "product.{$product->id}.average_rating";
    }
}
