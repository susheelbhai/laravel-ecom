import { useState, useEffect, useRef, useCallback } from 'react';
import BannerSlide from './banner-slide';
import SliderControls from './slider-controls';

interface Banner {
    id: number;
    imageUrl: string;
    href: string | null;
    target: '_self' | '_blank' | '_parent' | '_top';
    alt: string;
}

interface BannerSliderProps {
    banners: Banner[];
    autoPlayInterval?: number;
    className?: string;
}

export default function BannerSlider({
    banners,
    autoPlayInterval = 5000,
    className = '',
}: BannerSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartXRef = useRef<number | null>(null);
    const touchEndXRef = useRef<number | null>(null);

    // Navigation methods
    const nextSlide = useCallback(() => {
        if (isTransitioning || banners.length === 0) return;
        
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev + 1) % banners.length);
        
        setTimeout(() => setIsTransitioning(false), 500);
    }, [banners.length, isTransitioning]);

    const prevSlide = useCallback(() => {
        if (isTransitioning || banners.length === 0) return;
        
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
        
        setTimeout(() => setIsTransitioning(false), 500);
    }, [banners.length, isTransitioning]);

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning || index === currentIndex || banners.length === 0) return;
        
        setIsTransitioning(true);
        setCurrentIndex(index);
        
        setTimeout(() => setIsTransitioning(false), 500);
    }, [currentIndex, banners.length, isTransitioning]);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || banners.length <= 1) {
            return;
        }

        autoPlayTimerRef.current = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);

        return () => {
            if (autoPlayTimerRef.current) {
                clearInterval(autoPlayTimerRef.current);
            }
        };
    }, [isAutoPlaying, autoPlayInterval, nextSlide, banners.length]);

    // Pause auto-play on hover
    const handleMouseEnter = () => {
        setIsAutoPlaying(false);
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
        }
    };

    // Resume auto-play on hover end
    const handleMouseLeave = () => {
        setIsAutoPlaying(true);
    };

    // Touch/swipe support for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartXRef.current = e.touches[0].clientX;
        touchEndXRef.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartXRef.current === null || touchEndXRef.current === null) {
            return;
        }

        const swipeDistance = touchStartXRef.current - touchEndXRef.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swiped left - go to next slide
                nextSlide();
            } else {
                // Swiped right - go to previous slide
                prevSlide();
            }
        }

        touchStartXRef.current = null;
        touchEndXRef.current = null;
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    // Don't render if no banners
    if (banners.length === 0) {
        return null;
    }

    return (
        <div
            className={`relative h-48 md:h-56 w-full overflow-hidden ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Product banner slider"
            aria-live="polite"
        >
            {/* Banner Slides */}
            {banners.map((banner, index) => (
                <BannerSlide
                    key={banner.id}
                    banner={banner}
                    isActive={index === currentIndex}
                />
            ))}

            {/* Navigation Controls */}
            <SliderControls
                currentIndex={currentIndex}
                totalSlides={banners.length}
                onPrevious={prevSlide}
                onNext={nextSlide}
                onGoToSlide={goToSlide}
            />
        </div>
    );
}
