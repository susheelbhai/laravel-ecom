<?php

namespace App\Strategies;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FrequentlyBoughtTogetherStrategy extends AbstractRecommendationStrategy
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
     * Finds products frequently purchased in the same order as the current product.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return Collection<Product> Collection of recommended products
     */
    protected function fetchRecommendations(Product $product, ?User $user): Collection
    {
        // Get order IDs that contain the current product
        $orderIds = OrderItem::where('product_id', $product->id)
            ->pluck('order_id');

        if ($orderIds->isEmpty()) {
            return collect();
        }

        // Find products in those orders, calculate co-purchase frequency
        $productIds = OrderItem::query()
            ->select('product_id', DB::raw('COUNT(DISTINCT order_id) as co_purchase_count'))
            ->whereIn('order_id', $orderIds)
            ->where('product_id', '!=', $product->id)
            ->groupBy('product_id')
            ->orderByDesc('co_purchase_count')
            ->limit($this->getMaximumResults() * 2)
            ->pluck('co_purchase_count', 'product_id');

        if ($productIds->isEmpty()) {
            return collect();
        }

        // Load products with stock filtering
        $products = Product::query()
            ->with('media')
            ->whereIn('id', $productIds->keys())
            ->where('is_active', 1)
            ->get()
            ->filter(function (Product $p) {
                return $p->hasStock(1);
            })
            ->sortByDesc(function (Product $p) use ($productIds) {
                return $productIds[$p->id];
            })
            ->values();

        return $products;
    }
}
