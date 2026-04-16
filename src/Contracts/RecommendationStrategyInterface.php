<?php

namespace App\Contracts;

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

interface RecommendationStrategyInterface
{
    /**
     * Generate recommendations for a product.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user (null for guests)
     * @return Collection<Product> Collection of recommended products
     */
    public function recommend(Product $product, ?User $user): Collection;

    /**
     * Get the minimum number of results required to display this section.
     *
     * @return int Minimum result count
     */
    public function getMinimumResults(): int;

    /**
     * Get the maximum number of results to return.
     *
     * @return int Maximum result count
     */
    public function getMaximumResults(): int;

    /**
     * Get the cache key for this recommendation type.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return string Cache key
     */
    public function getCacheKey(Product $product, ?User $user): string;
}
