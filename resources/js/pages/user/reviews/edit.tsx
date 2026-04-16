import { Head, router, useForm } from '@inertiajs/react';
import { Star, X, Image as ImageIcon, Video as VideoIcon, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import AppLayout from '@/layouts/user/app-layout';
import { cn } from '@/lib/utils';
import { type Review, type Product } from '@/types';

interface EditReviewProps {
    review: Review;
    product: Product;
}

export default function EditReview({ review, product }: EditReviewProps) {
    const { data, setData, patch, processing, errors } = useForm({
        rating: review.rating,
        title: review.title || '',
        content: review.content,
        images: [] as File[],
        videos: [] as File[],
        deleted_media_ids: [] as number[],
    });

    const [hoveredRating, setHoveredRating] = useState(0);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState(
        review.media?.filter((m) => m.collection_name === 'images') || []
    );
    const [existingVideos, setExistingVideos] = useState(
        review.media?.filter((m) => m.collection_name === 'videos') || []
    );
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleRatingClick = (rating: number) => {
        setData('rating', rating);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalImages = existingImages.length + data.images.length + files.length;

        if (totalImages > 10) {
            alert('Maximum 10 images allowed');
            return;
        }

        const newImages = [...data.images, ...files];
        setData('images', newImages);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalVideos = existingVideos.length + data.videos.length + files.length;

        if (totalVideos > 3) {
            alert('Maximum 3 videos allowed');
            return;
        }

        const newVideos = [...data.videos, ...files];
        setData('videos', newVideos);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setVideoPreviews([...videoPreviews, ...newPreviews]);
    };

    const removeNewImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        setData('images', newImages);

        URL.revokeObjectURL(imagePreviews[index]);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(newPreviews);
    };

    const removeNewVideo = (index: number) => {
        const newVideos = data.videos.filter((_, i) => i !== index);
        setData('videos', newVideos);

        URL.revokeObjectURL(videoPreviews[index]);
        const newPreviews = videoPreviews.filter((_, i) => i !== index);
        setVideoPreviews(newPreviews);
    };

    const removeExistingImage = (mediaId: number) => {
        setExistingImages(existingImages.filter((img) => img.id !== mediaId));
        setData('deleted_media_ids', [...data.deleted_media_ids, mediaId]);
    };

    const removeExistingVideo = (mediaId: number) => {
        setExistingVideos(existingVideos.filter((vid) => vid.id !== mediaId));
        setData('deleted_media_ids', [...data.deleted_media_ids, mediaId]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('reviews.update', review.id), {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(route('product.show', product.slug));
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                console.error('All error keys:', Object.keys(errors));
                console.error('All error values:', Object.values(errors));
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            router.delete(route('reviews.destroy', review.id), {
                onSuccess: () => {
                    router.visit(route('product.show', product.slug));
                },
            });
        }
    };

    const renderStars = () => {
        const stars = [];
        const displayRating = hoveredRating || data.rating;

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => handleRatingClick(i)}
                    onMouseEnter={() => setHoveredRating(i)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    <Star
                        className={cn(
                            'h-8 w-8 transition-colors',
                            i <= displayRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-200',
                        )}
                    />
                </button>,
            );
        }
        return stars;
    };

    const characterCount = data.content.length;
    const maxCharacters = 5000;
    const totalImages = existingImages.length + data.images.length;
    const totalVideos = existingVideos.length + data.videos.length;

    return (
        <AppLayout title='Edit Review'>
            <Head title={`Edit Review - ${product.title}`} />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Edit Your Review</h1>
                    <p className="text-gray-600">
                        Editing review for: <span className="font-semibold">{product.title}</span>
                    </p>
                </div>

                {/* Display general errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h3>
                        <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                            {Object.entries(errors).map(([key, value]) => (
                                <li key={key}>{value}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-1">
                            {renderStars()}
                        </div>
                        {data.rating > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                {data.rating} {data.rating === 1 ? 'star' : 'stars'}
                            </p>
                        )}
                        {errors.rating && (
                            <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Review Title (Optional)
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Summarize your experience"
                            maxLength={255}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Review <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={6}
                            maxLength={maxCharacters}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                        <div className="flex justify-between items-center mt-1">
                            <div>
                                {errors.content && (
                                    <p className="text-sm text-red-600">{errors.content}</p>
                                )}
                            </div>
                            <p className={cn(
                                'text-sm',
                                characterCount < 10 ? 'text-red-600' : 'text-gray-600',
                            )}>
                                {characterCount} / {maxCharacters} characters
                                {characterCount < 10 && ' (minimum 10)'}
                            </p>
                        </div>
                    </div>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Images
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {existingImages.map((image) => (
                                    <div key={image.id} className="relative group">
                                        <img
                                            src={image.original_url}
                                            alt={image.file_name}
                                            className="h-24 w-24 object-cover rounded border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(image.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.deleted_media_ids && (
                                <p className="text-sm text-red-600 mt-1">{errors.deleted_media_ids}</p>
                            )}
                        </div>
                    )}

                    {/* New Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add Images (Optional, max 10 total)
                        </label>
                        <div className="space-y-3">
                            {imagePreviews.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`New preview ${index + 1}`}
                                                className="h-24 w-24 object-cover rounded border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {totalImages < 10 && (
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ImageIcon className="h-5 w-5" />
                                    <span>Add Images</span>
                                </button>
                            )}
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            {errors.images && (
                                <p className="text-sm text-red-600">{errors.images}</p>
                            )}
                        </div>
                    </div>

                    {/* Existing Videos */}
                    {existingVideos.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Videos
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {existingVideos.map((video) => (
                                    <div key={video.id} className="relative group">
                                        <video
                                            src={video.original_url}
                                            className="h-32 rounded border border-gray-200"
                                            controls
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingVideo(video.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Videos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add Videos (Optional, max 3 total)
                        </label>
                        <div className="space-y-3">
                            {videoPreviews.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {videoPreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <video
                                                src={preview}
                                                className="h-32 rounded border border-gray-200"
                                                controls
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewVideo(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {totalVideos < 3 && (
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <VideoIcon className="h-5 w-5" />
                                    <span>Add Videos</span>
                                </button>
                            )}
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/mp4,video/mpeg"
                                multiple
                                onChange={handleVideoUpload}
                                className="hidden"
                            />
                            {errors.videos && (
                                <p className="text-sm text-red-600">{errors.videos}</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Review
                        </button>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.visit(route('product.show', product.slug))}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing || data.rating === 0 || data.content.length < 10}
                                className={cn(
                                    'px-6 py-2 rounded-lg font-medium transition-colors',
                                    processing || data.rating === 0 || data.content.length < 10
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-primary/90',
                                )}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
