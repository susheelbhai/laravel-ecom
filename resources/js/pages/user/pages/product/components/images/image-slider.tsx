import { router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import ImageZoom from './image-zoom';
import ImageZoomExternal from './image-zoom-external';

const DEFAULT_FALLBACK_IMAGE = '/images/no-image.svg';

interface ProductImage {
    id: number;
    url: string;
    thumbnail: string;
    name: string;
    file_name: string;
    size: number;
    mime_type: string;
}

interface ImageSliderProps {
    images: ProductImage[];
    productTitle: string;
    productId: number;
    zoomType?: 'none' | 'internal' | 'external';
    zoomScale?: number;
    onExternalZoom?: (isActive: boolean, position: { x: number; y: number }, imageUrl: string) => void;
    fallbackImageUrl?: string;
}

export default function ImageSlider({
    images,
    productTitle,
    productId,
    zoomType = 'internal',
    zoomScale = 2.5,
    onExternalZoom,
    fallbackImageUrl,
}: ImageSliderProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    const { auth } = usePage().props as any;
    const isLoggedIn = auth?.user;

    // Check if product is in wishlist
    useEffect(() => {
        if (isLoggedIn) {
            // Check if product is in wishlist
            fetch(route('wishlist.check', { product_id: productId }), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setIsWishlisted(data.in_wishlist || false);
                })
                .catch((error) => {
                    console.error('Error checking wishlist status:', error);
                });
        }
    }, [productId, isLoggedIn]);

    const toggleWishlist = async () => {
        if (!isLoggedIn) {
            router.visit(route('login'));
            return;
        }

        setIsTogglingWishlist(true);
        try {
            const response = await fetch(route('wishlist.toggle'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    product_id: productId,
                }),
            });

            const data = await response.json();

            if (data.action === 'added') {
                setIsWishlisted(true);
            } else if (data.action === 'removed') {
                setIsWishlisted(false);
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    const fallbackImage = fallbackImageUrl || DEFAULT_FALLBACK_IMAGE;
    const safeImages =
        images && images.length > 0
            ? images
            : [
                  {
                      id: 0,
                      url: fallbackImage,
                      thumbnail: fallbackImage,
                      name: productTitle,
                      file_name: '',
                      size: 0,
                      mime_type: '',
                  },
              ];

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === safeImages.length - 1 ? 0 : prev + 1,
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? safeImages.length - 1 : prev - 1,
        );
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
        if (zoomType === 'external' && onExternalZoom) {
            onExternalZoom(
                false,
                { x: 50, y: 50 },
                safeImages[currentImageIndex].url,
            );
        }
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
        setDragOffset(0);
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setDragOffset(clientX - startX);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = 50;

        if (dragOffset < -threshold) {
            nextImage();
        } else if (dragOffset > threshold) {
            prevImage();
        }

        setDragOffset(0);
    };

    const handleContainerMouseLeave = () => {
        handleDragEnd();
        // Also hide external zoom when mouse leaves the container
        if (zoomType === 'external' && onExternalZoom) {
            onExternalZoom(
                false,
                { x: 50, y: 50 },
                safeImages[currentImageIndex].url,
            );
        }
    };

    return (
        <div className="flex aspect-square gap-4">
            {/* Thumbnail Navigation */}
            {safeImages.length > 1 && (
                <div className="flex h-full w-20 flex-col gap-2 overflow-y-auto">
                    {safeImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={`relative shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all ${
                                index === currentImageIndex
                                    ? 'ring-2 ring-primary ring-offset-2'
                                    : 'opacity-60 hover:opacity-100'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                            type="button"
                        >
                            <img
                                src={image.thumbnail || image.url || fallbackImage}
                                alt={`${productTitle} thumbnail ${index + 1}`}
                                onError={(e) => {
                                    e.currentTarget.src = fallbackImage;
                                }}
                                className="h-20 w-20 object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Carousel Container */}
            <div
                className="relative h-full flex-1 cursor-grab overflow-hidden rounded-xl shadow-lg select-none active:cursor-grabbing"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleContainerMouseLeave}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            >
                {/* Wishlist Heart Icon */}
                <button
                    onClick={toggleWishlist}
                    disabled={isTogglingWishlist}
                    className={`absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 transition-all ${
                        isWishlisted
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                    } shadow-lg backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-50`}
                    aria-label={
                        isWishlisted
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                    }
                    type="button"
                >
                    <Heart
                        className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''} transition-all`}
                    />
                </button>
                {/* Images Slider */}
                <div
                    className={`flex h-full ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
                    style={{
                        transform: `translateX(calc(-${currentImageIndex * 100}% + ${dragOffset}px))`,
                    }}
                >
                    {safeImages.map((image, index) => (
                        <div
                            key={image.id}
                            className="flex h-full w-full shrink-0 items-center justify-center bg-muted"
                        >
                            {zoomType === 'internal' ? (
                                <ImageZoom
                                    src={image.url || fallbackImage}
                                    alt={`${productTitle} - Image ${index + 1}`}
                                    className="h-full w-full"
                                    enabled={true}
                                    zoomScale={zoomScale}
                                    fallbackImageUrl={fallbackImage}
                                />
                            ) : zoomType === 'external' ? (
                                <ImageZoomExternal
                                    src={image.url || fallbackImage}
                                    alt={`${productTitle} - Image ${index + 1}`}
                                    className="h-full w-full"
                                    zoomScale={zoomScale}
                                    enabled={index === currentImageIndex && !isDragging}
                                    fallbackImageUrl={fallbackImage}
                                    onZoomChange={(active, pos) => {
                                        if (onExternalZoom) {
                                            onExternalZoom(
                                                active,
                                                pos || { x: 50, y: 50 },
                                                image.url || fallbackImage,
                                            );
                                        }
                                    }}
                                />
                            ) : (
                                <img
                                    src={image.url || fallbackImage}
                                    alt={`${productTitle} - Image ${index + 1}`}
                                    onError={(e) => {
                                        e.currentTarget.src = fallbackImage;
                                    }}
                                    className="pointer-events-none h-full w-full object-contain"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    draggable="false"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {safeImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 focus:ring-2 focus:ring-white focus:outline-none"
                            aria-label="Previous image"
                            type="button"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 focus:ring-2 focus:ring-white focus:outline-none"
                            aria-label="Next image"
                            type="button"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {safeImages.length > 1 && (
                    <div className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                        {currentImageIndex + 1} / {safeImages.length}
                    </div>
                )}
            </div>
        </div>
    );
}
