<?php

namespace App\Strategies;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CategoryBestSellersStrategy extends AbstractRecommendationStrategy
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
     * Finds best-selling products in the same category based on total quantity sold from paid orders.
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

        // Calculate total quantity sold for products in the same category from paid orders
        $productSales = OrderItem::query()
            ->select('order_items.product_id', DB::raw('SUM(order_items.quantity) as total_quantity'))
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.product_category_id', $categoryId)
            ->where('products.id', '!=', $product->id)
            ->where('products.is_active', 1)
            ->where('orders.payment_status', 'paid')
            ->groupBy('order_items.product_id')
            ->orderByDesc('total_quantity')
            ->limit($this->getMaximumResults() * 2)
            ->pluck('total_quantity', 'product_id');

        if ($productSales->isEmpty()) {
            return collect();
        }

        // Load products and sort by sales quantity
        $products = Product::query()
            ->with('media')
            ->whereIn('id', $productSales->keys())
            ->where('is_active', 1)
            ->get()
            ->sortByDesc(function (Product $p) use ($productSales) {
                return $productSales[$p->id];
            })
            ->values();

        return $products;
    }
}
