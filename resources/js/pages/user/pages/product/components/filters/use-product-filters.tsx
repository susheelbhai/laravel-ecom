import { router } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseProductFiltersProps {
    initialData: any;
    filters: any;
}

export function useProductFilters({
    initialData,
    filters,
}: UseProductFiltersProps) {
    const [products, setProducts] = useState(initialData.data || []);
    const [currentPage, setCurrentPage] = useState(
        initialData.current_page || 1,
    );
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(
        initialData.next_page_url ?? null,
    );
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || '',
    );
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [minRating, setMinRating] = useState(filters.min_rating || '');
    const [inStockOnly, setInStockOnly] = useState(filters.in_stock === 'true');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'latest');

    const observerTarget = useRef(null);

    const loadMoreProducts = useCallback(async () => {
        if (loading || !nextPageUrl) return;

        setLoading(true);
        const nextPage = currentPage + 1;

        try {
            const params = new URLSearchParams({
                page: nextPage.toString(),
                ...(searchQuery && { search: searchQuery }),
                ...(selectedCategory && { category: selectedCategory }),
                ...(minPrice && { min_price: minPrice }),
                ...(maxPrice && { max_price: maxPrice }),
                ...(minRating && { min_rating: minRating }),
                ...(inStockOnly && { in_stock: 'true' }),
                sort_by: sortBy,
            });

            const response = await fetch(
                `${route('product.index')}?${params}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );

            const data = await response.json();

            setProducts((prev: any[]) => [...prev, ...data.data]);
            setCurrentPage(data.current_page);
            setNextPageUrl(data.next_page_url ?? null);
        } catch (error) {
            console.error('Error loading more products:', error);
        } finally {
            setLoading(false);
        }
    }, [
        loading,
        currentPage,
        nextPageUrl,
        searchQuery,
        selectedCategory,
        minPrice,
        maxPrice,
        minRating,
        inStockOnly,
        sortBy,
    ]);

    // Infinite scroll observer
    useEffect(() => {
        const currentTarget = observerTarget.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    !loading &&
                    !!nextPageUrl
                ) {
                    loadMoreProducts();
                }
            },
            { threshold: 0.1 },
        );

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [
        loading,
        currentPage,
        nextPageUrl,
        searchQuery,
        selectedCategory,
        minPrice,
        maxPrice,
        minRating,
        inStockOnly,
        sortBy,
        loadMoreProducts,
    ]);

    const applyFilters = () => {
        const params: any = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
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
                // Update products with new filtered data
                setProducts(page.props.data.data || []);
                setCurrentPage(page.props.data.current_page || 1);
                setNextPageUrl(page.props.data.next_page_url ?? null);
            },
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setMinRating('');
        setInStockOnly(false);
        setSortBy('latest');
        router.get(
            route('product.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['data', 'filters', 'categories', 'priceRange'],
                onSuccess: (page: any) => {
                    setProducts(page.props.data.data || []);
                    setCurrentPage(page.props.data.current_page || 1);
                    setNextPageUrl(page.props.data.next_page_url ?? null);
                },
            },
        );
    };

    const hasActiveFilters =
        searchQuery ||
        selectedCategory ||
        minPrice ||
        maxPrice ||
        minRating ||
        inStockOnly ||
        sortBy !== 'latest';

    return {
        products,
        setProducts,
        currentPage,
        setCurrentPage,
        nextPageUrl,
        setNextPageUrl,
        loading,
        showFilters,
        setShowFilters,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        minRating,
        setMinRating,
        inStockOnly,
        setInStockOnly,
        sortBy,
        setSortBy,
        observerTarget,
        applyFilters,
        clearFilters,
        hasActiveFilters,
    };
}
