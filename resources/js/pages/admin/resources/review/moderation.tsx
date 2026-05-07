import { Head, router } from '@inertiajs/react';
import { Star, Check, X, Package, User, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { useState } from 'react';
import AppLayout from '@/layouts/admin/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type PaginatedReviews, type Review } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Review Moderation', href: route('admin.reviews.moderation') },
];

const getCSSVariable = (variable: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

interface ModerationProps {
    pendingReviews: PaginatedReviews;
}

export default function Moderation({ pendingReviews }: ModerationProps) {
    const [processingId, setProcessingId] = useState<number | null>(null);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={cn(
                        'h-4 w-4',
                        i <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300',
                    )}
                />,
            );
        }
        return stars;
    };

    const handleApprove = (reviewId: number) => {
        Swal.fire({
            title: 'Approve this review?',
            text: 'It will be visible to customers.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor:
                getCSSVariable('--primary') || '#2563eb',
            cancelButtonColor:
                getCSSVariable('--muted-foreground') || '#64748b',
            confirmButtonText: 'Yes, approve',
        }).then((result) => {
            if (result.isConfirmed) {
                setProcessingId(reviewId);
                router.patch(
                    route('admin.reviews.approve', reviewId),
                    {},
                    {
                        preserveScroll: true,
                        onFinish: () => setProcessingId(null),
                    },
                );
            }
        });
    };

    const handleReject = (reviewId: number) => {
        Swal.fire({
            title: 'Reject this review?',
            text: 'It will not be published.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor:
                getCSSVariable('--destructive') || '#dc2626',
            cancelButtonColor:
                getCSSVariable('--muted-foreground') || '#64748b',
            confirmButtonText: 'Yes, reject',
        }).then((result) => {
            if (result.isConfirmed) {
                setProcessingId(reviewId);
                router.patch(
                    route('admin.reviews.reject', reviewId),
                    {},
                    {
                        preserveScroll: true,
                        onFinish: () => setProcessingId(null),
                    },
                );
            }
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Moderation" />
            <div className="flex h-full flex-1 flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Review Moderation
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Approve or reject pending product reviews
                        </p>
                    </div>
                    <div className="rounded-lg bg-primary/10 px-4 py-2">
                        <span className="text-sm font-medium text-primary">
                            {pendingReviews.total} Pending Review
                            {pendingReviews.total !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {pendingReviews.data.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-card p-12">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <Check className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                All caught up!
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                There are no pending reviews to moderate at this
                                time.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingReviews.data.map((review: Review) => {
                            const images =
                                review.media?.filter(
                                    (m) => m.collection_name === 'images',
                                ) || [];
                            const videos =
                                review.media?.filter(
                                    (m) => m.collection_name === 'videos',
                                ) || [];

                            return (
                                <div
                                    key={review.id}
                                    className="rounded-xl border border-border bg-card p-6 shadow-sm"
                                >
                                    <div className="space-y-4">
                                        {/* Header with Product and User Info */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Package className="h-4 w-4" />
                                                    <span className="font-medium text-foreground">
                                                        {review.product?.title ||
                                                            'Product'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {review.user?.name ||
                                                                'Anonymous'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDate(
                                                                review.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>

                                        {/* Review Content */}
                                        <div className="space-y-2">
                                            {review.title && (
                                                <h4 className="font-semibold text-lg text-foreground">
                                                    {review.title}
                                                </h4>
                                            )}
                                            <p className="text-foreground whitespace-pre-wrap">
                                                {review.content}
                                            </p>
                                        </div>

                                        {/* Media */}
                                        {images.length > 0 && (
                                            <div className="flex gap-2 flex-wrap">
                                                {images.map((image) => (
                                                    <img
                                                        key={image.id}
                                                        src={image.url}
                                                        alt={image.file_name}
                                                        className="h-24 w-24 object-cover rounded border border-border"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {videos.length > 0 && (
                                            <div className="flex gap-2 flex-wrap">
                                                {videos.map((video) => (
                                                    <video
                                                        key={video.id}
                                                        src={video.url}
                                                        controls
                                                        className="h-48 rounded border border-border"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                                            <button
                                                onClick={() =>
                                                    handleApprove(review.id)
                                                }
                                                disabled={
                                                    processingId === review.id
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Check className="h-4 w-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleReject(review.id)
                                                }
                                                disabled={
                                                    processingId === review.id
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <X className="h-4 w-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {pendingReviews.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {pendingReviews.links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url || '#'}
                                className={cn(
                                    'px-3 py-1 rounded border text-sm',
                                    link.active
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'border-border hover:bg-muted',
                                    !link.url &&
                                        'opacity-50 cursor-not-allowed',
                                )}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
