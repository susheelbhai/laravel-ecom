<?php

namespace App\Strategies;

use App\Contracts\RecommendationStrategyInterface;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

abstract class AbstractRecommendationStrategy implements RecommendationStrategyInterface
{
    /**
     * Generate recommendations for a product.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user (null for guests)
     * @return Collection<Product> Collection of recommended products
     */
    public function recommend(Product $product, ?User $user): Collection
    {
        $recommendations = $this->fetchRecommendations($product, $user);

        return $this->applyCommonFilters($recommendations, $product)
            ->take($this->getMaximumResults());
    }

    /**
     * Fetch raw recommendations before filtering.
     * Subclasses must implement this method.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return Collection<Product> Collection of recommended products
     */
    abstract protected function fetchRecommendations(Product $product, ?User $user): Collection;

    /**
     * Apply common filters to recommendations.
     *
     * @param  Collection<Product>  $recommendations  The recommendations to filter
     * @param  Product  $product  The current product to exclude
     * @return Collection<Product> Filtered recommendations
     */
    protected function applyCommonFilters(Collection $recommendations, Product $product): Collection
    {
        return $recommendations
            ->filter(fn (Product $p) => $p->id !== $product->id)
            ->filter(fn (Product $p) => $p->is_active === 1);
    }

    /**
     * Apply common query filters to a query builder.
     * Use this method when building queries to avoid N+1 issues.
     *
     * @param  Builder  $query  The query builder
     * @param  Product  $product  The current product to exclude
     * @return Builder The filtered query builder
     */
    public function applyQueryFilters(Builder $query, Product $product): Builder
    {
        return $query
            ->with('media')
            ->where('id', '!=', $product->id)
            ->where('is_active', 1);
    }

    /**
     * Get the cache key for this recommendation type.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return string Cache key
     */
    public function getCacheKey(Product $product, ?User $user): string
    {
        $strategyName = class_basename(static::class);
        $userId = $user?->id ?? 'guest';

        return "recommendations:{$strategyName}:{$product->id}:{$userId}";
    }
}
