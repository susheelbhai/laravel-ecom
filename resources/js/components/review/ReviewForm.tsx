import { useForm } from '@inertiajs/react';
import { Star, Upload, X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
    productId: number;
    storeUrl: string;
    existingReview?: {
        rating: number;
        title: string | null;
        content: string;
    };
}

export default function ReviewForm({
    productId,
    storeUrl,
    existingReview,
}: ReviewFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: existingReview?.rating ?? 0,
        title: existingReview?.title ?? '',
        content: existingReview?.content ?? '',
        images: [] as File[],
        videos: [] as File[],
    });

    const [hoveredRating, setHoveredRating] = useState(0);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleRatingClick = (rating: number) => {
        setData('rating', rating);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentImages = data.images;

        if (currentImages.length + files.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }

        const newImages = [...currentImages, ...files];
        setData('images', newImages);

        // Create previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentVideos = data.videos;

        if (currentVideos.length + files.length > 3) {
            alert('Maximum 3 videos allowed');
            return;
        }

        const newVideos = [...currentVideos, ...files];
        setData('videos', newVideos);

        // Create previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setVideoPreviews([...videoPreviews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        setData('images', newImages);

        URL.revokeObjectURL(imagePreviews[index]);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(newPreviews);
    };

    const removeVideo = (index: number) => {
        const newVideos = data.videos.filter((_, i) => i !== index);
        setData('videos', newVideos);

        URL.revokeObjectURL(videoPreviews[index]);
        const newPreviews = videoPreviews.filter((_, i) => i !== index);
        setVideoPreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(storeUrl, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setImagePreviews([]);
                setVideoPreviews([]);
            },
        });
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-div border border-gray-200">
            <h3 className="text-xl font-semibold">Write a Review</h3>

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-div focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-div focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (Optional, max 10)
                </label>
                <div className="space-y-3">
                    {imagePreviews.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="h-24 w-24 object-cover rounded border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {data.images.length < 10 && (
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-button hover:bg-gray-50 transition-colors"
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
                    <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, WEBP. Max 5MB per image.
                    </p>
                </div>
            </div>

            {/* Video Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Videos (Optional, max 3)
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
                                        onClick={() => removeVideo(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {data.videos.length < 3 && (
                        <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-button hover:bg-gray-50 transition-colors"
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
                    <p className="text-xs text-gray-500">
                        Supported formats: MP4, MPEG. Max 50MB per video.
                    </p>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing || data.rating === 0 || data.content.length < 10}
                    className={cn(
                        'px-6 py-2 rounded-button font-medium transition-colors',
                        processing || data.rating === 0 || data.content.length < 10
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary/90',
                    )}
                >
                    {processing ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </form>
    );
}
