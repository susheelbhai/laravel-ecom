<?php

namespace App\Services;

use App\Models\Product;
use App\Models\RecommendationConfig;
use App\Models\User;
use App\Strategies\CategoryBestSellersStrategy;
use App\Strategies\CategoryTopRatedStrategy;
use App\Strategies\CoPurchaseStrategy;
use App\Strategies\FrequentlyBoughtTogetherStrategy;
use App\Strategies\RecentlyViewedStrategy;
use App\Strategies\RelatedProductsStrategy;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class RecommendationService
{
    private const CACHE_TTL = 86400; // 24 hours in seconds

    private array $strategies = [];

    public function __construct(
        FrequentlyBoughtTogetherStrategy $frequentlyBoughtTogether,
        RelatedProductsStrategy $relatedProducts,
        RecentlyViewedStrategy $recentlyViewed,
        CoPurchaseStrategy $coPurchase,
        CategoryBestSellersStrategy $categoryBestSellers,
        CategoryTopRatedStrategy $categoryTopRated
    ) {
        $this->strategies = [
            'frequently_bought_together' => $frequentlyBoughtTogether,
            'related_products' => $relatedProducts,
            'recently_viewed' => $recentlyViewed,
            'co_purchase' => $coPurchase,
            'category_best_sellers' => $categoryBestSellers,
            'category_top_rated' => $categoryTopRated,
        ];
    }

    /**
     * Get all enabled recommendations for a product.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user (null for guests)
     * @return array<string, array|Collection> Array of recommendation sections (arrays for frontend, collections for internal use)
     */
    public function getRecommendations(Product $product, ?User $user, bool $transformForFrontend = true): array
    {
        $enabledConfigs = RecommendationConfig::query()
            ->where('is_enabled', true)
            ->orderBy('display_order')
            ->get();

        $recommendations = [];

        foreach ($enabledConfigs as $config) {
            $sectionType = $config->section_type;

            if (! isset($this->strategies[$sectionType])) {
                continue;
            }

            $results = $this->getRecommendation($sectionType, $product, $user);

            // Only include sections that meet minimum threshold
            $strategy = $this->strategies[$sectionType];
            if ($results->count() >= $strategy->getMinimumResults()) {
                if ($transformForFrontend) {
                    // Transform products to include media URLs for frontend
                    $transformedResults = $results->map(function ($product) {
                        return array_merge($product->toArray(), [
                            'thumbnail' => $product->getFirstMediaUrl('images', 'small') ?: $product->getFirstMediaUrl('images') ?: null,
                            'display_img' => $product->getFirstMediaUrl('images') ?: null,
                            'average_rating' => $product->averageRating,
                            'review_count' => $product->reviewCount,
                        ]);
                    })->values()->all();

                    $recommendations[$sectionType] = $transformedResults;
                } else {
                    // Return collections for internal use (tests)
                    $recommendations[$sectionType] = $results;
                }
            }
        }

        return $recommendations;
    }

    /**
     * Get a specific recommendation type.
     *
     * @param  string  $type  The recommendation type
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return Collection<Product> Collection of recommended products
     */
    public function getRecommendation(string $type, Product $product, ?User $user): Collection
    {
        if (! isset($this->strategies[$type])) {
            return collect();
        }

        $strategy = $this->strategies[$type];
        $cacheKey = $strategy->getCacheKey($product, $user);

        // Cache only product IDs to avoid serialization issues when code/classes change.
        $ids = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($strategy, $product, $user) {
            $results = $strategy->recommend($product, $user);

            return $results
                ->filter(fn ($item) => $item instanceof Product)
                ->map(fn (Product $p) => $p->getKey())
                ->values()
                ->all();
        });

        if (! is_array($ids)) {
            Cache::forget($cacheKey);

            return $this->getRecommendation($type, $product, $user);
        }

        if ($ids === []) {
            return collect();
        }

        $products = Product::query()
            ->whereKey($ids)
            ->get()
            ->keyBy(fn (Product $p) => (string) $p->getKey());

        // Preserve the original recommendation order.
        return collect($ids)
            ->map(fn ($id) => $products->get((string) $id))
            ->filter()
            ->values();
    }

    /**
     * Invalidate cached recommendations for a product.
     *
     * @param  Product  $product  The product whose cache to invalidate
     */
    public function invalidateCache(Product $product): void
    {
        foreach ($this->strategies as $type => $strategy) {
            // Invalidate for both guest and potential user scenarios
            $guestCacheKey = $strategy->getCacheKey($product, null);
            Cache::forget($guestCacheKey);

            // For user-specific caches, we'd need to iterate through users
            // For now, we'll use a pattern-based approach if the cache driver supports it
            $pattern = "recommendations:*:{$product->id}:*";

            // Note: This is a simplified approach. In production, consider using cache tags
            // or maintaining a list of affected cache keys
        }
    }
}
