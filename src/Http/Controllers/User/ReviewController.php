<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Product;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(private ReviewService $reviewService) {}

    /**
     * Display reviews for a product.
     */
    public function index(Product $product, \Illuminate\Http\Request $request): Response
    {
        $sortBy = $request->input('sort', 'recent');
        $perPage = $request->input('per_page', 10);

        $reviews = $this->reviewService->getProductReviews($product, $sortBy, $perPage);

        return Inertia::render('Reviews/Index', [
            'product' => $product,
            'reviews' => $reviews,
            'sortBy' => $sortBy,
        ]);
    }

    /**
     * Store a new review.
     */
    public function store(StoreReviewRequest $request, Product $product): RedirectResponse
    {
        $review = $this->reviewService->createReview(
            $request->user(),
            $product,
            $request->validated()
        );

        // Attach media if present
        if ($request->hasFile('images') || $request->hasFile('videos')) {
            $this->reviewService->attachMedia($review, [
                'images' => $request->file('images', []),
                'videos' => $request->file('videos', []),
            ]);
        }

        return redirect()->back()->with('success', 'Review submitted successfully and is pending approval.');
    }

    /**
     * Show the form for editing a review.
     */
    public function edit(Review $review): Response
    {
        // Ensure the user owns this review
        if ($review->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $review->load(['media', 'product']);

        return Inertia::render('user/reviews/edit', [
            'review' => $review,
            'product' => $review->product,
        ]);
    }

    /**
     * Update an existing review.
     */
    public function update(UpdateReviewRequest $request, Review $review): RedirectResponse
    {
        $this->reviewService->updateReview($review, $request->validated());

        // Attach new media if present
        if ($request->hasFile('images') || $request->hasFile('videos')) {
            $this->reviewService->attachMedia($review, [
                'images' => $request->file('images', []),
                'videos' => $request->file('videos', []),
            ]);
        }

        return redirect()->back()->with('success', 'Review updated successfully.');
    }

    /**
     * Delete a review.
     */
    public function destroy(Review $review): RedirectResponse
    {
        $this->reviewService->deleteReview($review);

        return redirect()->back()->with('success', 'Review deleted successfully.');
    }
}
