<?php

namespace App\Services;

use App\Models\BrowsingHistory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

class BrowsingHistoryService
{
    /**
     * Record a product view for authenticated or guest user.
     */
    public function recordView(Product $product, ?User $user): void
    {
        if ($user) {
            // Authenticated user - store in database
            BrowsingHistory::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                ],
                [
                    'viewed_at' => now(),
                    'session_id' => null,
                ]
            );

            // Prune history to maintain 50-record limit
            $this->pruneHistory($user);
        } else {
            // Guest user - store in session
            $sessionId = session()->getId();

            BrowsingHistory::updateOrCreate(
                [
                    'session_id' => $sessionId,
                    'product_id' => $product->id,
                ],
                [
                    'viewed_at' => now(),
                    'user_id' => null,
                ]
            );

            // Prune guest history to maintain 50-record limit
            $this->pruneGuestHistory($sessionId);
        }
    }

    /**
     * Get browsing history for a user.
     */
    public function getHistory(?User $user, int $limit = 50): Collection
    {
        if ($user) {
            // Authenticated user - get from database
            return Product::query()
                ->with('media')
                ->join('browsing_histories', 'products.id', '=', 'browsing_histories.product_id')
                ->where('browsing_histories.user_id', $user->id)
                ->where('products.is_active', 1)
                ->orderBy('browsing_histories.viewed_at', 'desc')
                ->limit($limit)
                ->select('products.*')
                ->get();
        } else {
            // Guest user - get from session
            $sessionId = session()->getId();

            return Product::query()
                ->with('media')
                ->join('browsing_histories', 'products.id', '=', 'browsing_histories.product_id')
                ->where('browsing_histories.session_id', $sessionId)
                ->whereNull('browsing_histories.user_id')
                ->where('products.is_active', 1)
                ->orderBy('browsing_histories.viewed_at', 'desc')
                ->limit($limit)
                ->select('products.*')
                ->get();
        }
    }

    /**
     * Merge guest session history with authenticated user history.
     */
    public function mergeGuestHistory(User $user): void
    {
        $sessionId = session()->getId();

        // Get all guest history records for this session
        $guestHistory = BrowsingHistory::where('session_id', $sessionId)
            ->whereNull('user_id')
            ->get();

        foreach ($guestHistory as $guestRecord) {
            // Check if user already has a record for this product
            $existingRecord = BrowsingHistory::where('user_id', $user->id)
                ->where('product_id', $guestRecord->product_id)
                ->first();

            if ($existingRecord) {
                // Keep the most recent timestamp
                if ($guestRecord->viewed_at > $existingRecord->viewed_at) {
                    $existingRecord->update([
                        'viewed_at' => $guestRecord->viewed_at,
                    ]);
                }
                // Delete the guest record
                $guestRecord->delete();
            } else {
                // Transfer guest record to authenticated user
                $guestRecord->update([
                    'user_id' => $user->id,
                    'session_id' => null,
                ]);
            }
        }

        // Prune history to maintain 50-record limit
        $this->pruneHistory($user);
    }

    /**
     * Prune history to maintain maximum limit.
     */
    public function pruneHistory(User $user, int $maxLimit = 50): void
    {
        $count = BrowsingHistory::where('user_id', $user->id)->count();

        if ($count > $maxLimit) {
            $recordsToDelete = $count - $maxLimit;

            // Get IDs of oldest records to delete
            $idsToDelete = BrowsingHistory::where('user_id', $user->id)
                ->orderBy('viewed_at', 'asc')
                ->limit($recordsToDelete)
                ->pluck('id');

            // Delete oldest records
            BrowsingHistory::whereIn('id', $idsToDelete)->delete();
        }
    }

    /**
     * Prune guest history to maintain maximum limit.
     */
    protected function pruneGuestHistory(string $sessionId, int $maxLimit = 50): void
    {
        $count = BrowsingHistory::where('session_id', $sessionId)
            ->whereNull('user_id')
            ->count();

        if ($count > $maxLimit) {
            $recordsToDelete = $count - $maxLimit;

            // Get IDs of oldest records to delete
            $idsToDelete = BrowsingHistory::where('session_id', $sessionId)
                ->whereNull('user_id')
                ->orderBy('viewed_at', 'asc')
                ->limit($recordsToDelete)
                ->pluck('id');

            // Delete oldest records
            BrowsingHistory::whereIn('id', $idsToDelete)->delete();
        }
    }
}
