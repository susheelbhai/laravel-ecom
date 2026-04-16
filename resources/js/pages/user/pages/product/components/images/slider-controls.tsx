import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderControlsProps {
    currentIndex: number;
    totalSlides: number;
    onPrevious: () => void;
    onNext: () => void;
    onGoToSlide: (index: number) => void;
}

export default function SliderControls({
    currentIndex,
    totalSlides,
    onPrevious,
    onNext,
    onGoToSlide,
}: SliderControlsProps) {
    // Don't render controls if there's only one or no slides
    if (totalSlides <= 1) {
        return null;
    }

    return (
        <>
            {/* Previous Button */}
            <button
                onClick={onPrevious}
                className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Previous banner"
                type="button"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Button */}
            <button
                onClick={onNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Next banner"
                type="button"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onGoToSlide(index)}
                        className={`h-2 w-2 rounded-full transition-all focus:ring-2 focus:ring-white focus:outline-none ${
                            index === currentIndex
                                ? 'bg-white w-6'
                                : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to banner ${index + 1}`}
                        aria-current={index === currentIndex ? 'true' : 'false'}
                        type="button"
                    />
                ))}
            </div>
        </>
    );
}
