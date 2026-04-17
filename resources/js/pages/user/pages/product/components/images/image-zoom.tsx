import { useState, useRef, useEffect } from 'react';
import { handleProductImageError, PRODUCT_FALLBACK_IMAGE_URL } from '@/lib/product-image-fallback';

interface ImageZoomProps {
    src: string;
    alt: string;
    className?: string;
    zoomScale?: number;
    enabled?: boolean;
    fallbackImageUrl?: string;
}

export default function ImageZoom({
    src,
    alt,
    className = '',
    zoomScale = 2.5,
    enabled = true,
    fallbackImageUrl = PRODUCT_FALLBACK_IMAGE_URL,
}: ImageZoomProps) {
    const [isZooming, setIsZooming] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!imageRef.current || !isZooming) return;

            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            setPosition({ x, y });
        };

        if (isZooming) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isZooming, enabled]);

    const handleMouseEnter = () => {
        if (enabled) {
            setIsZooming(true);
        }
    };

    const handleMouseLeave = () => {
        if (enabled) {
            setIsZooming(false);
        }
    };

    if (!enabled) {
        return (
            <img
                src={src || fallbackImageUrl}
                alt={alt}
                onError={(e) =>
                    handleProductImageError(e, fallbackImageUrl)
                }
                className="pointer-events-none h-full w-full object-contain"
                loading="lazy"
                draggable="false"
            />
        );
    }

    return (
        <div
            ref={imageRef}
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={src || fallbackImageUrl}
                alt={alt}
                onError={(e) =>
                    handleProductImageError(e, fallbackImageUrl)
                }
                className="pointer-events-none h-full w-full object-contain transition-opacity duration-200"
                loading="lazy"
                style={{
                    opacity: isZooming ? 0 : 1,
                }}
                draggable="false"
            />
            {isZooming && (
                <div
                    className="absolute inset-0 bg-white"
                    style={{
                        backgroundImage: `url(${src || fallbackImageUrl})`,
                        backgroundSize: `${zoomScale * 100}%`,
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            )}
        </div>
    );
}
