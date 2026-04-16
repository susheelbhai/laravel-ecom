<?php

namespace App\Strategies;

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CategoryTopRatedStrategy extends AbstractRecommendationStrategy
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
        return 6;
    }

    /**
     * Fetch raw recommendations before filtering.
     * Finds top-rated products in the same category with at least 3 approved reviews.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return Collection<Product> Collection of recommended products
     */
    protected function fetchRecommendations(Product $product, ?User $user): Collection
    {
        // Get the category ID of the current product
        $categoryId = $product->product_category_id;

        if (! $categoryId) {
            return collect();
        }

        // Calculate average rating for products in the same category with at least 3 approved reviews
        $productRatings = DB::table('reviews')
            ->select('reviews.product_id', DB::raw('AVG(reviews.rating) as avg_rating'), DB::raw('COUNT(*) as review_count'))
            ->join('products', 'reviews.product_id', '=', 'products.id')
            ->where('products.product_category_id', $categoryId)
            ->where('products.id', '!=', $product->id)
            ->where('products.is_active', 1)
            ->where('reviews.status', 'approved')
            ->groupBy('reviews.product_id')
            ->having('review_count', '>=', 3)
            ->orderByDesc('avg_rating')
            ->limit($this->getMaximumResults() * 2)
            ->pluck('avg_rating', 'product_id');

        if ($productRatings->isEmpty()) {
            return collect();
        }

        // Load products and sort by average rating
        $products = Product::query()
            ->with('media')
            ->whereIn('id', $productRatings->keys())
            ->where('is_active', 1)
            ->get()
            ->sortByDesc(function (Product $p) use ($productRatings) {
                return $productRatings[$p->id];
            })
            ->values();

        return $products;
    }
}
