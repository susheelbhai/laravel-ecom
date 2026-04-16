import { Star } from 'lucide-react';
import type { RatingDistribution } from '@/types';

interface AverageRatingProps {
    averageRating: number;
    reviewCount: number;
    showDistribution?: boolean;
    distribution?: RatingDistribution;
}

export default function AverageRating({
    averageRating,
    reviewCount,
    showDistribution = false,
    distribution,
}: AverageRatingProps) {
    const renderStars = (rating: number) => {
        const stars = [];
        
        // Map decimal values to visual percentages for better distinction
        // 0.1 -> 30%, 0.2 -> 35%, 0.3 -> 40%, 0.4 -> 45%, 0.5 -> 50%
        // 0.6 -> 55%, 0.7 -> 60%, 0.8 -> 65%, 0.9 -> 70%
        const mapDecimalToPercentage = (decimal: number): number => {
            if (decimal <= 0) return 0;
            if (decimal >= 1) return 100;
            
            // Map 0.1-0.9 to 30%-70%
            const minPercent = 30;
            const maxPercent = 70;
            const range = maxPercent - minPercent;
            
            // Linear interpolation from 0.1-0.9 to 30%-70%
            return Math.round(minPercent + (decimal - 0.1) * (range / 0.8));
        };
        
        for (let i = 1; i <= 5; i++) {
            const starValue = i;
            const difference = rating - (starValue - 1);
            
            if (difference >= 1) {
                // Full star
                stars.push(
                    <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />,
                );
            } else if (difference <= 0) {
                // Empty star
                stars.push(
                    <Star key={i} className="h-5 w-5 text-gray-300" />,
                );
            } else {
                // Partial star - map decimal to percentage
                const fillPercentage = mapDecimalToPercentage(difference);
                stars.push(
                    <div key={i} className="relative h-5 w-5">
                        <Star className="h-5 w-5 text-gray-300" />
                        <div 
                            className="absolute inset-0 overflow-hidden" 
                            style={{ width: `${fillPercentage}%` }}
                        >
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>,
                );
            }
        }

        return stars;
    };

    if (reviewCount === 0) {
        return (
            <div className="flex items-center gap-2 text-gray-500">
                <div className="flex gap-1">{renderStars(0)}</div>
                <span className="text-sm">No reviews yet</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-0">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">{renderStars(averageRating)}</div>
                    <span className="text-2xl font-bold">
                        {averageRating.toFixed(1)}
                    </span>
                </div>
                <span className="text-xs text-gray-600">
                    based on {reviewCount}{' '}
                    {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
            </div>

            {showDistribution && distribution && (
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = distribution[rating as keyof RatingDistribution] || 0;
                        const percentage =
                            reviewCount > 0
                                ? (count / reviewCount) * 100
                                : 0;

                        return (
                            <div
                                key={rating}
                                className="flex items-center gap-2"
                            >
                                <span className="w-8 text-sm text-gray-600">
                                    {rating} <Star className="inline h-3 w-3" />
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-12 text-sm text-gray-600 text-right">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
