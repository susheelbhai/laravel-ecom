<?php

namespace App\Services;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

class VerifiedPurchaseService
{
    /**
     * Check if user has purchased a product.
     */
    public function hasPurchased(User $user, Product $product): bool
    {
        return OrderItem::query()
            ->where('product_id', $product->id)
            ->whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('payment_status', 'paid');
            })
            ->exists();
    }

    /**
     * Check if user can review a product.
     */
    public function canReview(User $user, Product $product): bool
    {
        return $this->hasPurchased($user, $product);
    }
}
