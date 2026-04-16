import { useRef, useState } from 'react';
import { ProductCard } from './product-card';

interface Product {
    id: number;
    slug: string;
    title: string;
    price: number;
    thumbnail?: string;
    image?: string;
    display_img?: string;
    average_rating?: number;
    averageRating?: number;
    review_count?: number;
    reviewCount?: number;
    is_active: number;
    in_stock?: boolean;
}

interface RecommendationSectionProps {
    title: string;
    products: Product[];
    columns?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
}

export function RecommendationSection({
    title,
    products,
}: RecommendationSectionProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    if (!products || products.length === 0) {
        return null;
    }

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        
        const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
        const newScrollLeft = direction === 'left' 
            ? scrollContainerRef.current.scrollLeft - scrollAmount
            : scrollContainerRef.current.scrollLeft + scrollAmount;
        
        scrollContainerRef.current.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    return (
        <section className="mb-12">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
                <div className="flex gap-2">
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                            aria-label="Scroll left"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {showRightArrow && (
                        <button
                            onClick={() => scroll('right')}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                            aria-label="Scroll right"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <div className="relative overflow-hidden">
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-scroll pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[160px] max-w-[160px] flex-shrink-0 snap-start sm:min-w-[200px] sm:max-w-[200px] lg:min-w-[220px] lg:max-w-[220px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
