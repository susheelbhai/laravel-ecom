import { Link } from '@inertiajs/react';
import AverageRating from '@/components/review/AverageRating';
import ReviewForm from '@/components/review/ReviewForm';
import ReviewList from '@/components/review/ReviewList';
import type { RatingDistribution } from '@/types';

interface ProductReviewsSectionProps {
    productId: number;
    reviews: any;
    averageRating: number;
    reviewCount: number;
    ratingDistribution: RatingDistribution;
    sortBy: string;
    ratingFilter: number | null;
    auth: any;
    canReview: boolean;
    hasPurchased: boolean;
}

export default function ProductReviewsSection({
    productId,
    reviews,
    averageRating,
    reviewCount,
    ratingDistribution,
    sortBy,
    ratingFilter,
    auth,
    canReview,
    hasPurchased,
}: ProductReviewsSectionProps) {
    return (
        <div className="border-t border-gray-200 pt-8">
            <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>

            {/* Average Rating Display */}
            {reviewCount > 0 && (
                <div className="mb-8 rounded-div bg-gray-50 p-6">
                    <AverageRating
                        averageRating={averageRating}
                        reviewCount={reviewCount}
                        showDistribution={true}
                        distribution={ratingDistribution}
                    />
                </div>
            )}

            {/* Review Form */}
            {auth?.user ? (
                canReview ? (
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold">
                            Write a Review
                        </h3>
                        <ReviewForm
                            productId={productId}
                            storeUrl={`/products/${productId}/reviews`}
                        />
                    </div>
                ) : hasPurchased ? (
                    <div className="mb-8 rounded-div border border-blue-200 bg-blue-50 p-4">
                        <p className="text-blue-800">
                            You have already submitted a review for this
                            product.
                        </p>
                    </div>
                ) : (
                    <div className="mb-8 rounded-div border border-yellow-200 bg-yellow-50 p-4">
                        <p className="text-yellow-800">
                            You must purchase this product before you can review
                            it.
                        </p>
                    </div>
                )
            ) : (
                <div className="mb-8 rounded-div border border-gray-200 bg-gray-50 p-4">
                    <p className="text-gray-700">
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Login
                        </Link>{' '}
                        to write a review for this product.
                    </p>
                </div>
            )}

            {/* Reviews List */}
            {reviews && (
                <ReviewList
                    reviews={reviews}
                    sortBy={sortBy}
                    onSortChange={(sort) => {
                        const params = new URLSearchParams();
                        params.set('sort_by', sort);
                        if (ratingFilter) {
                            params.set('rating', ratingFilter.toString());
                        }
                        window.location.href = `?${params.toString()}`;
                    }}
                    canVote={!!auth?.user}
                    voteUrlTemplate={`/reviews/{review}/vote`}
                    editUrlTemplate={
                        auth?.user ? `/reviews/{review}/edit` : undefined
                    }
                    ratingFilter={ratingFilter}
                    onRatingFilterChange={(rating) => {
                        const params = new URLSearchParams();
                        params.set('sort_by', sortBy);
                        if (rating) {
                            params.set('rating', rating.toString());
                        }
                        window.location.href = `?${params.toString()}`;
                    }}
                />
            )}
        </div>
    );
}
