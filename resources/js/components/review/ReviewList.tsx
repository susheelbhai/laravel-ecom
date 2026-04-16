import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginatedReviews } from '@/types';
import ReviewItem from './ReviewItem';

interface ReviewListProps {
    reviews: PaginatedReviews;
    sortBy: string;
    onSortChange: (sort: string) => void;
    canVote: boolean;
    voteUrlTemplate: string;
    editUrlTemplate?: string;
    ratingFilter?: number | null;
    onRatingFilterChange?: (rating: number | null) => void;
}

export default function ReviewList({
    reviews,
    sortBy,
    onSortChange,
    canVote,
    voteUrlTemplate,
    editUrlTemplate,
    ratingFilter,
    onRatingFilterChange,
}: ReviewListProps) {
    const sortOptions = [
        { value: 'recent', label: 'Most Recent' },
        { value: 'highest', label: 'Highest Rated' },
        { value: 'lowest', label: 'Lowest Rated' },
        { value: 'helpful', label: 'Most Helpful' },
    ];

    const ratingOptions = [
        { value: null, label: 'All Ratings' },
        { value: 5, label: '5 Stars' },
        { value: 4, label: '4 Stars' },
        { value: 3, label: '3 Stars' },
        { value: 2, label: '2 Stars' },
        { value: 1, label: '1 Star' },
    ];

    const renderPaginationLinks = () => {
        const links = [];
        const currentPage = reviews.current_page;
        const lastPage = reviews.last_page;

        if (lastPage <= 1) return null;

        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(lastPage, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        const buildUrl = (page: number) => {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('sort_by', sortBy);
            if (ratingFilter) {
                params.set('rating', ratingFilter.toString());
            }
            return `?${params.toString()}`;
        };

        for (let i = startPage; i <= endPage; i++) {
            links.push(
                <Link
                    key={i}
                    href={buildUrl(i)}
                    preserveScroll
                    className={cn(
                        'px-3 py-1 rounded border text-sm',
                        i === currentPage
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-gray-300 hover:bg-gray-50',
                    )}
                >
                    {i}
                </Link>,
            );
        }

        return links;
    };

    if (reviews.data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    No reviews yet. Be the first to review this product!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-xl font-semibold">
                    Customer Reviews ({reviews.total})
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Rating Filter */}
                    {onRatingFilterChange && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="rating-filter" className="text-sm text-gray-600 whitespace-nowrap">
                                Filter by:
                            </label>
                            <select
                                id="rating-filter"
                                value={ratingFilter ?? ''}
                                onChange={(e) => onRatingFilterChange(e.target.value ? parseInt(e.target.value) : null)}
                                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {ratingOptions.map((option) => (
                                    <option key={option.value ?? 'all'} value={option.value ?? ''}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
                            Sort by:
                        </label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {reviews.data.map((review) => (
                    <ReviewItem
                        key={review.id}
                        review={review}
                        canVote={canVote}
                        userVote={review.user_vote}
                        voteUrl={voteUrlTemplate.replace(
                            '{review}',
                            review.id.toString(),
                        )}
                        editUrl={
                            editUrlTemplate
                                ? editUrlTemplate.replace(
                                      '{review}',
                                      review.id.toString(),
                                  )
                                : undefined
                        }
                    />
                ))}
            </div>

            {reviews.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    {reviews.current_page > 1 && (
                        <Link
                            href={(() => {
                                const params = new URLSearchParams();
                                params.set('page', (reviews.current_page - 1).toString());
                                params.set('sort_by', sortBy);
                                if (ratingFilter) {
                                    params.set('rating', ratingFilter.toString());
                                }
                                return `?${params.toString()}`;
                            })()}
                            preserveScroll
                            className="flex items-center gap-1 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    )}

                    {renderPaginationLinks()}

                    {reviews.current_page < reviews.last_page && (
                        <Link
                            href={(() => {
                                const params = new URLSearchParams();
                                params.set('page', (reviews.current_page + 1).toString());
                                params.set('sort_by', sortBy);
                                if (ratingFilter) {
                                    params.set('rating', ratingFilter.toString());
                                }
                                return `?${params.toString()}`;
                            })()}
                            preserveScroll
                            className="flex items-center gap-1 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            )}

            {reviews.total > 0 && (
                <div className="text-center text-sm text-gray-600">
                    Showing {reviews.from} to {reviews.to} of {reviews.total}{' '}
                    reviews
                </div>
            )}
        </div>
    );
}
