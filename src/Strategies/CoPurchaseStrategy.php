<?php

namespace App\Strategies;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CoPurchaseStrategy extends AbstractRecommendationStrategy
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
     * Identifies products purchased by users who also bought the current product.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return Collection<Product> Collection of recommended products
     */
    protected function fetchRecommendations(Product $product, ?User $user): Collection
    {
        // Step 1: Identify users who purchased the current product (from paid orders only)
        $userIds = OrderItem::query()
            ->select('orders.user_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.payment_status', 'paid')
            ->distinct()
            ->pluck('user_id');

        if ($userIds->isEmpty()) {
            return collect();
        }

        // Step 2: Aggregate other products purchased by those users
        // Step 3: Rank by purchase frequency (number of users who purchased each product)
        $productFrequencies = OrderItem::query()
            ->select('order_items.product_id', DB::raw('COUNT(DISTINCT orders.user_id) as user_count'))
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereIn('orders.user_id', $userIds)
            ->where('orders.payment_status', 'paid')
            ->where('order_items.product_id', '!=', $product->id)
            ->groupBy('order_items.product_id')
            ->orderByDesc('user_count')
            ->limit($this->getMaximumResults() * 2)
            ->pluck('user_count', 'product_id');

        if ($productFrequencies->isEmpty()) {
            return collect();
        }

        // Step 4: Load products and filter for active products
        $products = Product::query()
            ->with('media')
            ->whereIn('id', $productFrequencies->keys())
            ->where('is_active', 1)
            ->get()
            ->sortByDesc(function (Product $p) use ($productFrequencies) {
                return $productFrequencies[$p->id];
            })
            ->values();

        return $products;
    }
}
