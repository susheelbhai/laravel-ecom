import { router, usePage } from '@inertiajs/react';
import { Grid, List, Grid2x2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import AppLayout from '@/layouts/user/app-layout';
import SearchBar from './components/filters/search-bar';
import SidebarFilter from './components/filters/sidebar-filter';
import { useProductFilters } from './components/filters/use-product-filters';
import BannerSlider from './components/images/banner-slider';
import ProductBanner from './components/images/product-banner';
import EmptyState from './components/ui/empty-state';
import LoadingIndicator from './components/ui/loading-indicator';
import ProductGrid from './components/ui/product-grid';

type ViewMode = 'grid-2' | 'grid-3' | 'grid-4' | 'grid-5' | 'list';

interface Banner {
    id: number;
    imageUrl: string;
    href: string | null;
    target: '_self' | '_blank' | '_parent' | '_top';
    alt: string;
}

// Get default grid based on screen size
const getDefaultViewMode = (): ViewMode => {
    if (typeof window === 'undefined') return 'grid-3';
    
    const width = window.innerWidth;
    if (width < 640) return 'grid-2'; // mobile
    if (width < 1024) return 'grid-3'; // tablet
    if (width < 1536) return 'grid-4'; // desktop
    return 'grid-5'; // large desktop
};

export default function Products() {
    const {
        data: initialData,
        categories,
        priceRange,
        filters,
    } = usePage().props as any;

    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        // Try to get from localStorage first
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('product-view-mode');
            if (saved && ['grid-2', 'grid-3', 'grid-4', 'grid-5', 'list'].includes(saved)) {
                return saved as ViewMode;
            }
        }
        return getDefaultViewMode();
    });

    const [banners, setBanners] = useState<Banner[]>([]);
    const [bannersLoading, setBannersLoading] = useState(true);
    const [bannersError, setBannersError] = useState(false);

    // Save to localStorage when view mode changes
    useEffect(() => {
        localStorage.setItem('product-view-mode', viewMode);
    }, [viewMode]);

    // Fetch banners from API on page load
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/product-page-banners');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch banners');
                }
                
                const data = await response.json();
                setBanners(data);
                setBannersError(false);
            } catch (error) {
                console.error('Error fetching banners:', error);
                setBannersError(true);
            } finally {
                setBannersLoading(false);
            }
        };

        fetchBanners();
    }, []);

    const {
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
    } = useProductFilters({ initialData, filters });

    return (
        <AppLayout title="Products">
            <div className="min-h-screen bg-background">
                {/* Show BannerSlider if banners loaded successfully, otherwise fallback to static banner */}
                {!bannersLoading && !bannersError && banners.length > 0 ? (
                    <BannerSlider banners={banners} />
                ) : (
                    <ProductBanner />
                )}

                <Container className="py-8 md:py-12">
                    <div className="flex gap-8">
                        {/* Sidebar Filters */}
                        <aside className="hidden w-64 flex-shrink-0 lg:block">
                            <SidebarFilter
                                minPrice={minPrice}
                                setMinPrice={setMinPrice}
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                categories={categories}
                                priceRange={priceRange}
                                applyFilters={applyFilters}
                                searchQuery={searchQuery}
                                minRating={minRating}
                                setMinRating={setMinRating}
                                inStockOnly={inStockOnly}
                                setInStockOnly={setInStockOnly}
                                sortBy={sortBy}
                                setProducts={setProducts}
                                setCurrentPage={setCurrentPage}
                                setNextPageUrl={setNextPageUrl}
                            />
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Top Bar */}
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                {/* View Toggle */}
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
                                    <button
                                        onClick={() => setViewMode('grid-2')}
                                        className={`rounded p-2 transition-colors ${
                                            viewMode === 'grid-2'
                                                ? 'bg-secondary text-white'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        aria-label="2x2 Grid view"
                                        title="2x2 Grid"
                                    >
                                        <Grid2x2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid-3')}
                                        className={`rounded p-2 transition-colors ${
                                            viewMode === 'grid-3'
                                                ? 'bg-secondary text-white'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        aria-label="3x3 Grid view"
                                        title="3x3 Grid"
                                    >
                                        <Grid className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid-4')}
                                        className={`flex items-center justify-center rounded p-2 transition-colors ${
                                            viewMode === 'grid-4'
                                                ? 'bg-secondary text-white'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        aria-label="4x4 Grid view"
                                        title="4x4 Grid"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="5" height="5" />
                                            <rect x="10" y="3" width="5" height="5" />
                                            <rect x="17" y="3" width="5" height="5" />
                                            <rect x="3" y="10" width="5" height="5" />
                                            <rect x="10" y="10" width="5" height="5" />
                                            <rect x="17" y="10" width="5" height="5" />
                                            <rect x="3" y="17" width="5" height="5" />
                                            <rect x="10" y="17" width="5" height="5" />
                                            <rect x="17" y="17" width="5" height="5" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid-5')}
                                        className={`flex items-center justify-center rounded p-2 transition-colors ${
                                            viewMode === 'grid-5'
                                                ? 'bg-secondary text-white'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        aria-label="5x5 Grid view"
                                        title="5x5 Grid"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="3" height="3" />
                                            <rect x="8" y="3" width="3" height="3" />
                                            <rect x="13" y="3" width="3" height="3" />
                                            <rect x="18" y="3" width="3" height="3" />
                                            <rect x="3" y="8" width="3" height="3" />
                                            <rect x="8" y="8" width="3" height="3" />
                                            <rect x="13" y="8" width="3" height="3" />
                                            <rect x="18" y="8" width="3" height="3" />
                                            <rect x="3" y="13" width="3" height="3" />
                                            <rect x="8" y="13" width="3" height="3" />
                                            <rect x="13" y="13" width="3" height="3" />
                                            <rect x="18" y="13" width="3" height="3" />
                                            <rect x="3" y="18" width="3" height="3" />
                                            <rect x="8" y="18" width="3" height="3" />
                                            <rect x="13" y="18" width="3" height="3" />
                                            <rect x="18" y="18" width="3" height="3" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`rounded p-2 transition-colors ${
                                            viewMode === 'list'
                                                ? 'bg-secondary text-white'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        aria-label="List view"
                                        title="List View"
                                    >
                                        <List className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Sort and Show */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-foreground">
                                        Sort By :
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            const newSortBy = e.target.value;
                                            setSortBy(newSortBy);
                                            
                                            // Build params with the new sort value
                                            const params: any = {};
                                            if (searchQuery) params.search = searchQuery;
                                            if (selectedCategory) params.category = selectedCategory;
                                            if (minPrice) params.min_price = minPrice;
                                            if (maxPrice) params.max_price = maxPrice;
                                            if (minRating) params.min_rating = minRating;
                                            if (inStockOnly) params.in_stock = 'true';
                                            params.sort_by = newSortBy;

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
                                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="latest">
                                            Latest
                                        </option>
                                        <option value="oldest">
                                            Oldest
                                        </option>
                                        <option value="price_low">
                                            Price: Low to High
                                        </option>
                                        <option value="price_high">
                                            Price: High to Low
                                        </option>
                                        <option value="rating_high">
                                            Rating: High to Low
                                        </option>
                                        <option value="rating_low">
                                            Rating: Low to High
                                        </option>
                                        <option value="title_asc">
                                            Name (A-Z)
                                        </option>
                                        <option value="title_desc">
                                            Name (Z-A)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Products Grid or Empty State */}
                            {products.length === 0 ? (
                                <EmptyState
                                    hasActiveFilters={hasActiveFilters}
                                    onClearFilters={clearFilters}
                                />
                            ) : (
                                <ProductGrid
                                    products={products}
                                    viewMode={viewMode}
                                />
                            )}

                            {/* Loading indicator */}
                            {loading && <LoadingIndicator />}

                            {/* Intersection observer target */}
                            {!!nextPageUrl && (
                                <div ref={observerTarget} className="h-10" />
                            )}

                            {/* End message */}
                            {!nextPageUrl && products.length > 0 && (
                                <div className="py-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        You've reached the end of our product
                                        catalog
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </AppLayout>
    );
}
