import { router } from '@inertiajs/react';
import { useState } from 'react';

interface SidebarFilterProps {
    minPrice: string;
    setMinPrice: (value: string) => void;
    maxPrice: string;
    setMaxPrice: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    categories: any[];
    priceRange: any;
    manufacturers?: any[];
    selectedManufacturers?: string[];
    setSelectedManufacturers?: (value: string[]) => void;
    selectedColors?: string[];
    setSelectedColors?: (value: string[]) => void;
    applyFilters: () => void;
    searchQuery: string;
    minRating: string;
    setMinRating: (value: string) => void;
    inStockOnly: boolean;
    setInStockOnly: (value: boolean) => void;
    sortBy: string;
    setProducts: (products: any[]) => void;
    setCurrentPage: (page: number) => void;
    setNextPageUrl: (url: string | null) => void;
}

export default function SidebarFilter({
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    selectedCategory,
    setSelectedCategory,
    categories,
    priceRange,
    applyFilters,
    searchQuery,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setProducts,
    setCurrentPage,
    setNextPageUrl,
}: SidebarFilterProps) {
    const categoryOptions = Array.isArray(categories) ? categories : [];

    const [localMinPrice, setLocalMinPrice] = useState(
        minPrice || priceRange?.min_price || 0,
    );
    const [localMaxPrice, setLocalMaxPrice] = useState(
        maxPrice || priceRange?.max_price || 500,
    );

    const handleMinPriceChange = (value: number) => {
        // Ensure min doesn't exceed max
        const newMin = Math.min(value, parseInt(localMaxPrice.toString()));
        setLocalMinPrice(newMin);
    };

    const handleMaxPriceChange = (value: number) => {
        // Ensure max doesn't go below min
        const newMax = Math.max(value, parseInt(localMinPrice.toString()));
        setLocalMaxPrice(newMax);
    };

    const handlePriceChangeEnd = () => {
        setMinPrice(localMinPrice.toString());
        setMaxPrice(localMaxPrice.toString());
        
        // Build params with the new price values
        const params: any = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        params.min_price = localMinPrice.toString();
        params.max_price = localMaxPrice.toString();
        if (minRating) params.min_rating = minRating;
        if (inStockOnly) params.in_stock = 'true';
        if (sortBy) params.sort_by = sortBy;

        router.get(route('product.index'), params, {
            preserveState: true,
            preserveScroll: true,
            only: ['data', 'filters', 'categories', 'priceRange'],
            onSuccess: (page: any) => {
                setProducts(page.props.data.data || []);
                setCurrentPage(page.props.data.current_page || 1);
                setNextPageUrl(page.props.data.next_page_url ?? null);
            },
        });
    };

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        
        // Build params with the new category value
        const params: any = {};
        if (searchQuery) params.search = searchQuery;
        params.category = categoryId;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (minRating) params.min_rating = minRating;
        if (inStockOnly) params.in_stock = 'true';
        if (sortBy) params.sort_by = sortBy;

        router.get(route('product.index'), params, {
            preserveState: true,
            preserveScroll: true,
            only: ['data', 'filters', 'categories', 'priceRange'],
            onSuccess: (page: any) => {
                setProducts(page.props.data.data || []);
                setCurrentPage(page.props.data.current_page || 1);
                setNextPageUrl(page.props.data.next_page_url ?? null);
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Filter By Price */}
            <div className="rounded-div border border-border bg-card p-4">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Filter By Price
                </h3>
                <div className="space-y-4">
                    {/* Dual Range Slider Container */}
                    <div className="relative h-2">
                        {/* Background track */}
                        <div className="absolute top-0 h-2 w-full rounded-div bg-gray-200"></div>
                        
                        {/* Active range track */}
                        <div
                            className="absolute top-0 h-2 rounded-div bg-secondary"
                            style={{
                                left: `${((parseInt(localMinPrice.toString()) - (priceRange?.min_price || 0)) / ((priceRange?.max_price || 500) - (priceRange?.min_price || 0))) * 100}%`,
                                right: `${100 - ((parseInt(localMaxPrice.toString()) - (priceRange?.min_price || 0)) / ((priceRange?.max_price || 500) - (priceRange?.min_price || 0))) * 100}%`,
                            }}
                        ></div>

                        {/* Min price slider */}
                        <input
                            type="range"
                            min={priceRange?.min_price || 0}
                            max={priceRange?.max_price || 500}
                            value={localMinPrice}
                            onChange={(e) =>
                                handleMinPriceChange(parseInt(e.target.value))
                            }
                            onMouseUp={handlePriceChangeEnd}
                            onTouchEnd={handlePriceChangeEnd}
                            className="pointer-events-none absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:shadow-md"
                        />

                        {/* Max price slider */}
                        <input
                            type="range"
                            min={priceRange?.min_price || 0}
                            max={priceRange?.max_price || 500}
                            value={localMaxPrice}
                            onChange={(e) =>
                                handleMaxPriceChange(parseInt(e.target.value))
                            }
                            onMouseUp={handlePriceChangeEnd}
                            onTouchEnd={handlePriceChangeEnd}
                            className="pointer-events-none absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:shadow-md"
                        />
                    </div>

                    {/* Price labels */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                            ₹{localMinPrice}
                        </span>
                        <span className="font-medium text-foreground">
                            ₹{localMaxPrice}
                        </span>
                    </div>
                </div>
            </div>

            {/* Categories */}
            {categoryOptions.length > 0 && (
                <div className="rounded-div border border-border bg-card p-4">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                        Categories
                    </h3>
                    <div className="space-y-2">
                        <label className="flex cursor-pointer items-center gap-2 text-sm hover:text-secondary">
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={selectedCategory === ''}
                                onChange={(e) =>
                                    handleCategoryChange(e.target.value)
                                }
                                className="h-4 w-4 border-border text-secondary focus:ring-2 focus:ring-secondary/20"
                            />
                            <span
                                className={
                                    selectedCategory === ''
                                        ? 'font-semibold text-secondary'
                                        : 'text-foreground'
                                }
                            >
                                All Categories
                            </span>
                        </label>
                        {categoryOptions.map((category: any) => (
                            <label
                                key={category.id}
                                className="flex cursor-pointer items-center gap-2 text-sm hover:text-secondary"
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    value={category.slug}
                                    checked={
                                        selectedCategory === category.slug
                                    }
                                    onChange={(e) =>
                                        handleCategoryChange(e.target.value)
                                    }
                                    className="h-4 w-4 border-border text-secondary focus:ring-2 focus:ring-secondary/20"
                                />
                                <span
                                    className={
                                        selectedCategory === category.slug
                                            ? 'font-semibold text-secondary'
                                            : 'text-foreground'
                                    }
                                >
                                    {category.title}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Minimum Rating Filter */}
            <div className="rounded-div border border-border bg-card p-4">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Minimum Rating
                </h3>
                <div className="space-y-2">
                    {[4.5, 4, 3.5, 3].map((rating) => (
                        <label
                            key={rating}
                            className="flex cursor-pointer items-center gap-2 text-sm hover:text-secondary"
                        >
                            <input
                                type="radio"
                                name="rating"
                                value={rating}
                                checked={minRating === rating.toString()}
                                onChange={(e) => {
                                    const newRating = e.target.value;
                                    setMinRating(newRating);
                                    
                                    // Build params with the new rating value
                                    const params: any = {};
                                    if (searchQuery) params.search = searchQuery;
                                    if (selectedCategory) params.category = selectedCategory;
                                    if (minPrice) params.min_price = minPrice;
                                    if (maxPrice) params.max_price = maxPrice;
                                    params.min_rating = newRating;
                                    if (inStockOnly) params.in_stock = 'true';
                                    if (sortBy) params.sort_by = sortBy;

                                    router.get(route('product.index'), params, {
                                        preserveState: true,
                                        preserveScroll: true,
                                        only: ['data', 'filters', 'categories', 'priceRange'],
                                        onSuccess: (page: any) => {
                                            setProducts(page.props.data.data || []);
                                            setCurrentPage(page.props.data.current_page || 1);
                                            setNextPageUrl(page.props.data.next_page_url ?? null);
                                        },
                                    });
                                }}
                                className="h-4 w-4 border-border text-secondary focus:ring-2 focus:ring-secondary/20"
                            />
                            <span
                                className={
                                    minRating === rating.toString()
                                        ? 'font-semibold text-secondary'
                                        : 'text-foreground'
                                }
                            >
                                {rating} Stars & Up
                            </span>
                        </label>
                    ))}
                    <label className="flex cursor-pointer items-center gap-2 text-sm hover:text-secondary">
                        <input
                            type="radio"
                            name="rating"
                            value=""
                            checked={minRating === ''}
                            onChange={(e) => {
                                setMinRating('');
                                
                                // Build params without rating
                                const params: any = {};
                                if (searchQuery) params.search = searchQuery;
                                if (selectedCategory) params.category = selectedCategory;
                                if (minPrice) params.min_price = minPrice;
                                if (maxPrice) params.max_price = maxPrice;
                                if (inStockOnly) params.in_stock = 'true';
                                if (sortBy) params.sort_by = sortBy;

                                router.get(route('product.index'), params, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    only: ['data', 'filters', 'categories', 'priceRange'],
                                    onSuccess: (page: any) => {
                                        setProducts(page.props.data.data || []);
                                        setCurrentPage(page.props.data.current_page || 1);
                                        setNextPageUrl(page.props.data.next_page_url ?? null);
                                    },
                                });
                            }}
                            className="h-4 w-4 border-border text-secondary focus:ring-2 focus:ring-secondary/20"
                        />
                        <span
                            className={
                                minRating === ''
                                    ? 'font-semibold text-secondary'
                                    : 'text-foreground'
                            }
                        >
                            All Ratings
                        </span>
                    </label>
                </div>
            </div>

            {/* Stock Availability Filter */}
            <div className="rounded-div border border-border bg-card p-4">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Availability
                </h3>
                <label className="flex cursor-pointer items-center gap-2 text-sm hover:text-secondary">
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => {
                            const newInStockOnly = e.target.checked;
                            setInStockOnly(newInStockOnly);
                            
                            // Build params with the new stock value
                            const params: any = {};
                            if (searchQuery) params.search = searchQuery;
                            if (selectedCategory) params.category = selectedCategory;
                            if (minPrice) params.min_price = minPrice;
                            if (maxPrice) params.max_price = maxPrice;
                            if (minRating) params.min_rating = minRating;
                            if (newInStockOnly) params.in_stock = 'true';
                            if (sortBy) params.sort_by = sortBy;

                            router.get(route('product.index'), params, {
                                preserveState: true,
                                preserveScroll: true,
                                only: ['data', 'filters', 'categories', 'priceRange'],
                                onSuccess: (page: any) => {
                                    setProducts(page.props.data.data || []);
                                    setCurrentPage(page.props.data.current_page || 1);
                                    setNextPageUrl(page.props.data.next_page_url ?? null);
                                },
                            });
                        }}
                        className="h-4 w-4 rounded border-border text-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                    <span className="text-foreground">
                        In Stock Only
                    </span>
                </label>
            </div>
        </div>
    );
}
