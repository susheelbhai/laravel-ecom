import { router, usePage } from '@inertiajs/react';
import { Star, ThumbsUp, ThumbsDown, Edit } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Review, ReviewVote } from '@/types';

interface ReviewItemProps {
    review: Review;
    canVote: boolean;
    userVote?: ReviewVote;
    voteUrl: string;
    editUrl?: string;
}

export default function ReviewItem({
    review,
    canVote,
    userVote,
    voteUrl,
    editUrl,
}: ReviewItemProps) {
    const { auth } = usePage().props as any;
    const [isVoting, setIsVoting] = useState(false);
    const [currentVote, setCurrentVote] = useState<ReviewVote | undefined>(
        userVote,
    );
    const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
    const [notHelpfulCount, setNotHelpfulCount] = useState(
        review.not_helpful_count,
    );
    
    const isOwner = auth?.user?.id === review.user_id;

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
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />,
                );
            } else if (difference <= 0) {
                // Empty star
                stars.push(
                    <Star key={i} className="h-4 w-4 text-gray-300" />,
                );
            } else {
                // Partial star - map decimal to percentage
                const fillPercentage = mapDecimalToPercentage(difference);
                stars.push(
                    <div key={i} className="relative h-4 w-4">
                        <Star className="h-4 w-4 text-gray-300" />
                        <div 
                            className="absolute inset-0 overflow-hidden" 
                            style={{ width: `${fillPercentage}%` }}
                        >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>,
                );
            }
        }
        
        return stars;
    };

    const handleVote = (voteType: 'helpful' | 'not_helpful') => {
        if (!canVote || isVoting) return;

        setIsVoting(true);

        router.post(
            voteUrl,
            { vote_type: voteType },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const updatedReview = page.props.review as Review;
                    if (updatedReview) {
                        setHelpfulCount(updatedReview.helpful_count);
                        setNotHelpfulCount(updatedReview.not_helpful_count);
                        setCurrentVote(updatedReview.user_vote);
                    }
                },
                onFinish: () => {
                    setIsVoting(false);
                },
            },
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const images = review.media?.filter((m) => m.collection_name === 'images') || [];
    const videos = review.media?.filter((m) => m.collection_name === 'videos') || [];
    return (
        <div className="border-b border-gray-200 py-6 last:border-b-0">
            <div className="flex items-start gap-4">
                {review.user?.avatar ? (
                    <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="h-10 w-10 rounded-full"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}

                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">
                                    {review.user?.name || 'Anonymous'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {formatDate(review.created_at)}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {renderStars(review.rating)}
                            </div>
                        </div>
                        {isOwner && editUrl && (
                            <button
                                onClick={() => router.visit(editUrl)}
                                className="flex items-center gap-1 px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </button>
                        )}
                    </div>

                    {review.title && (
                        <h4 className="font-semibold text-lg">
                            {review.title}
                        </h4>
                    )}

                    <p className="text-gray-700 whitespace-pre-wrap">
                        {review.content}
                    </p>

                    {images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {images.map((image) => (
                                <img
                                    key={image.id}
                                    src={image.original_url}
                                    alt={image.file_name}
                                    className="h-24 w-24 object-cover rounded border border-gray-200"
                                />
                            ))}
                        </div>
                    )}

                    {videos.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {videos.map((video) => (
                                <video
                                    key={video.id}
                                    src={video.original_url}
                                    controls
                                    className="h-48 rounded border border-gray-200"
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-2">
                        <span className="text-sm text-gray-600">
                            Was this helpful?
                        </span>
                        <button
                            onClick={() => handleVote('helpful')}
                            disabled={!canVote || isVoting}
                            className={cn(
                                'flex items-center gap-1 px-3 py-1 rounded border text-sm transition-colors',
                                currentVote?.vote_type === 'helpful'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-300 hover:border-green-500 hover:bg-green-50',
                                !canVote && 'opacity-50 cursor-not-allowed',
                            )}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{helpfulCount}</span>
                        </button>
                        <button
                            onClick={() => handleVote('not_helpful')}
                            disabled={!canVote || isVoting}
                            className={cn(
                                'flex items-center gap-1 px-3 py-1 rounded border text-sm transition-colors',
                                currentVote?.vote_type === 'not_helpful'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50',
                                !canVote && 'opacity-50 cursor-not-allowed',
                            )}
                        >
                            <ThumbsDown className="h-4 w-4" />
                            <span>{notHelpfulCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
