import { useState, useRef, useEffect } from 'react';

interface ImageZoomExternalProps {
    src: string;
    alt: string;
    className?: string;
    zoomScale?: number;
    onZoomChange?: (isZooming: boolean, position?: { x: number; y: number }) => void;
    enabled?: boolean;
    fallbackImageUrl?: string;
}

export default function ImageZoomExternal({
    src,
    alt,
    className = '',
    zoomScale = 2.5,
    onZoomChange,
    enabled = true,
    fallbackImageUrl = '/images/no-image.svg',
}: ImageZoomExternalProps) {
    const [isZooming, setIsZooming] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled && isZooming) {
            setIsZooming(false);
            onZoomChange?.(false);
        }
    }, [enabled, isZooming, onZoomChange]);

    useEffect(() => {
        if (!enabled) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!imageRef.current || !isZooming) return;

            const rect = imageRef.current.getBoundingClientRect();
            
            // Check if mouse is still within the image bounds
            const isInside = 
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (!isInside) {
                setIsZooming(false);
                onZoomChange?.(false);
                return;
            }

            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            const newPosition = {
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
            };
            
            setPosition(newPosition);
            onZoomChange?.(true, newPosition);
        };

        if (isZooming) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isZooming, enabled, onZoomChange]);

    const handleMouseEnter = () => {
        if (!enabled) return;
        setIsZooming(true);
        onZoomChange?.(true, position);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
        onZoomChange?.(false);
    };

    if (!enabled) {
        return (
            <img
                src={src || fallbackImageUrl}
                alt={alt}
                onError={(e) => {
                    e.currentTarget.src = fallbackImageUrl;
                }}
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
                onError={(e) => {
                    e.currentTarget.src = fallbackImageUrl;
                }}
                className="pointer-events-none h-full w-full object-contain"
                loading="lazy"
                draggable="false"
            />
            {/* Hover Lens Indicator */}
            {isZooming && (
                <div
                    className="pointer-events-none absolute border-2 border-primary bg-white/20 backdrop-blur-sm"
                    style={{
                        width: `${100 / zoomScale}%`,
                        height: `${100 / zoomScale}%`,
                        left: `${Math.max(0, Math.min(100 - 100 / zoomScale, position.x - 50 / zoomScale))}%`,
                        top: `${Math.max(0, Math.min(100 - 100 / zoomScale, position.y - 50 / zoomScale))}%`,
                    }}
                />
            )}
        </div>
    );
}

// Separate component for the zoom panel
export function ImageZoomPanel({
    src,
    position,
    zoomScale = 2.5,
    isVisible,
}: {
    src: string;
    position: { x: number; y: number };
    zoomScale?: number;
    isVisible: boolean;
}) {
    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 hidden lg:block">
            <div
                className="h-full w-full overflow-hidden rounded-xl border-2 border-border bg-white shadow-2xl"
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: `${zoomScale * 100}%`,
                    backgroundPosition: `${position.x}% ${position.y}%`,
                    backgroundRepeat: 'no-repeat',
                }}
            />
        </div>
    );
}
