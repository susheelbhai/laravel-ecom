<?php

namespace App\Strategies;

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

class RelatedProductsStrategy extends AbstractRecommendationStrategy
{
    /**
     * Get the minimum number of results required to display this section.
     */
    public function getMinimumResults(): int
    {
        return 3;
    }

    /**
     * Get the maximum number of results to return.
     */
    public function getMaximumResults(): int
    {
        return 8;
    }

    /**
     * Fetch raw recommendations before filtering.
     * Finds products in the same category with similar price ranges.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return Collection<Product> Collection of recommended products
     */
    protected function fetchRecommendations(Product $product, ?User $user): Collection
    {
        // Calculate price range (±30%)
        $minPrice = $product->price * 0.7;
        $maxPrice = $product->price * 1.3;

        // Query products in same category with similar price range
        $products = Product::query()
            ->with('media')
            ->where('product_category_id', $product->product_category_id)
            ->whereBetween('price', [$minPrice, $maxPrice])
            ->where('id', '!=', $product->id)
            ->where('is_active', 1)
            ->limit($this->getMaximumResults())
            ->get();

        return $products;
    }
}
