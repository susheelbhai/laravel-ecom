<?php

namespace App\Strategies;

use App\Models\Product;
use App\Models\User;
use App\Services\BrowsingHistoryService;
use Illuminate\Support\Collection;

class RecentlyViewedStrategy extends AbstractRecommendationStrategy
{
    public function __construct(
        protected BrowsingHistoryService $browsingHistoryService
    ) {}

    /**
     * Get the minimum number of results required to display this section.
     */
    public function getMinimumResults(): int
    {
        return 2;
    }

    /**
     * Get the maximum number of results to return.
     */
    public function getMaximumResults(): int
    {
        return 10;
    }

    /**
     * Fetch raw recommendations before filtering.
     * Retrieves user's browsing history in reverse chronological order.
     *
     * @param  Product  $product  The current product
     * @param  User|null  $user  The current user
     * @return Collection<Product> Collection of recommended products
     */
    protected function fetchRecommendations(Product $product, ?User $user): Collection
    {
        // Get browsing history from service (already filtered for active products and ordered by viewed_at desc)
        $history = $this->browsingHistoryService->getHistory($user, $this->getMaximumResults() + 1);

        // Filter out the current product
        return $history->filter(fn (Product $p) => $p->id !== $product->id)
            ->take($this->getMaximumResults());
    }
}
