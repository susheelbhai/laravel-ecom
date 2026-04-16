<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Services\ReviewCacheService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReviewModerationController extends Controller
{
    public function __construct(private ReviewCacheService $cacheService) {}

    /**
     * List pending reviews.
     */
    public function index(): Response
    {
        $pendingReviews = Review::with(['user', 'product'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/resources/review/moderation', [
            'pendingReviews' => $pendingReviews,
        ]);
    }

    /**
     * Approve a review.
     */
    public function approve(Review $review): RedirectResponse
    {
        $review->update(['status' => 'approved']);

        // Invalidate cache
        $this->cacheService->invalidateProductCache($review->product);

        return redirect()->back()->with('success', 'Review approved successfully.');
    }

    /**
     * Reject a review.
     */
    public function reject(Review $review): RedirectResponse
    {
        $review->update(['status' => 'rejected']);

        return redirect()->back()->with('success', 'Review rejected successfully.');
    }
}
