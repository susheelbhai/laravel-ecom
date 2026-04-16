import AverageRating from '@/components/review/AverageRating';

interface ProductHeaderProps {
    title: string;
    category?: { title: string };
    averageRating: number;
    reviewCount: number;
}

export default function ProductHeader({
    title,
    category,
    averageRating,
    reviewCount,
}: ProductHeaderProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                {title}
            </h1>
            {category && (
                <p className="mt-2 text-sm text-muted-foreground">
                    Category: {category.title}
                </p>
            )}
            {/* Star Rating */}
            {reviewCount > 0 ? (
                <div className="mt-3 flex items-center gap-2">
                    <AverageRating
                        averageRating={averageRating}
                        reviewCount={reviewCount}
                        showDistribution={false}
                    />
                </div>
            ) : (
                <div className="mt-3 flex items-center gap-2 text-gray-500">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <svg
                                key={i}
                                className="h-5 w-5 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                        ))}
                    </div>
                    <span className="text-sm">No reviews yet</span>
                </div>
            )}
        </div>
    );
}
