import { X, SortAsc, DollarSign, Package, Star } from 'lucide-react';

interface FilterPanelProps {
    sortBy: string;
    setSortBy: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    minPrice: string;
    setMinPrice: (value: string) => void;
    maxPrice: string;
    setMaxPrice: (value: string) => void;
    minRating: string;
    setMinRating: (value: string) => void;
    inStockOnly: boolean;
    setInStockOnly: (value: boolean) => void;
    categories: any[];
    priceRange: any;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export default function FilterPanel({
    sortBy,
    setSortBy,
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
    categories,
    priceRange,
    hasActiveFilters,
    onClearFilters,
}: FilterPanelProps) {
    return (
        <div className="space-y-4 rounded-div border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                        Clear all
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Sort By */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        <SortAsc className="mr-1 inline h-4 w-4" />
                        Sort By
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full rounded-div border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="rating_high">Rating: High to Low</option>
                        <option value="rating_low">Rating: Low to High</option>
                        <option value="title_asc">Name (A-Z)</option>
                        <option value="title_desc">Name (Z-A)</option>
                    </select>
                </div>

                {/* Category Filter */}
                {categories && categories.length > 0 && (
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full rounded-div border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.slug}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Price Range */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        <DollarSign className="mr-1 inline h-4 w-4" />
                        Min Price
                    </label>
                    <input
                        type="number"
                        placeholder={`Min: ${priceRange?.min_price || 0}`}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full rounded-div border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        <DollarSign className="mr-1 inline h-4 w-4" />
                        Max Price
                    </label>
                    <input
                        type="number"
                        placeholder={`Max: ${priceRange?.max_price || 0}`}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full rounded-div border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                </div>

                {/* Minimum Rating Filter */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        <Star className="mr-1 inline h-4 w-4" />
                        Minimum Rating
                    </label>
                    <select
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        className="w-full rounded-div border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                        <option value="">All Ratings</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="3.5">3.5+ Stars</option>
                        <option value="3">3+ Stars</option>
                    </select>
                </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center gap-2 pt-2">
                <input
                    type="checkbox"
                    id="in_stock"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                />
                <label
                    htmlFor="in_stock"
                    className="flex items-center gap-1 text-sm font-medium"
                >
                    <Package className="h-4 w-4" />
                    Show only in-stock products
                </label>
            </div>
        </div>
    );
}
