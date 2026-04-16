<?php

namespace Susheelbhai\Ecom\Observers;

use App\Models\Review;
use Illuminate\Support\Facades\DB;

class ReviewObserver
{
    public function created(Review $review): void
    {
        if ($review->status !== 'approved') {
            return;
        }

        $this->applyDelta((int) $review->product_id, (int) $review->rating, 1);
    }

    public function updated(Review $review): void
    {
        $originalStatus = (string) $review->getOriginal('status');
        $originalRating = (int) $review->getOriginal('rating');
        $originalProductId = (int) $review->getOriginal('product_id');

        $newStatus = (string) $review->status;
        $newRating = (int) $review->rating;
        $newProductId = (int) $review->product_id;

        if ($originalProductId !== $newProductId) {
            if ($originalStatus === 'approved') {
                $this->applyDelta($originalProductId, -$originalRating, -1);
            }
            if ($newStatus === 'approved') {
                $this->applyDelta($newProductId, $newRating, 1);
            }

            return;
        }

        if ($originalStatus !== $newStatus) {
            if ($originalStatus === 'approved' && $newStatus !== 'approved') {
                $this->applyDelta($newProductId, -$originalRating, -1);
            } elseif ($originalStatus !== 'approved' && $newStatus === 'approved') {
                $this->applyDelta($newProductId, $newRating, 1);
            }

            return;
        }

        if ($newStatus === 'approved' && $originalRating !== $newRating) {
            $this->applyDelta($newProductId, $newRating - $originalRating, 0);
        }
    }

    public function deleted(Review $review): void
    {
        if ($review->status !== 'approved') {
            return;
        }

        $this->applyDelta((int) $review->product_id, -(int) $review->rating, -1);
    }

    private function applyDelta(int $productId, int $ratingSumDelta, int $countDelta): void
    {
        DB::table('products')
            ->where('id', $productId)
            ->update([
                'rating_sum' => DB::raw("GREATEST(rating_sum + ({$ratingSumDelta}), 0)"),
                'review_count' => DB::raw("GREATEST(review_count + ({$countDelta}), 0)"),
                'average_rating' => DB::raw(
                    'CASE '.
                    "WHEN (review_count + ({$countDelta})) <= 0 THEN 0 ".
                    "ELSE (rating_sum + ({$ratingSumDelta})) / (review_count + ({$countDelta})) ".
                    'END'
                ),
            ]);
    }
}
