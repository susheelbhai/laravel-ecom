import { Link, router, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { useMemo } from 'react';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { WishlistButton } from '@/components/product/wishlist-button';
import AverageRating from '@/components/review/AverageRating';
import { useFormatMoney } from '@/hooks/use-format-money';

type ViewMode = 'grid-2' | 'grid-3' | 'grid-4' | 'grid-5' | 'list';

const FALLBACK_IMAGE = '/images/no-image.svg';

interface ProductGridProps {
    products: any[];
    viewMode: ViewMode;
}

export default function ProductGrid({ products, viewMode }: ProductGridProps) {
    const { formatMoney } = useFormatMoney();
    const uniqueProducts = useMemo(() => {
        const seen = new Set<number | string>();
        const result: any[] = [];

        for (const p of products ?? []) {
            const id = p?.id;
            if (id === null || id === undefined) {
                result.push(p);
                continue;
            }
            if (seen.has(id)) continue;
            seen.add(id);
            result.push(p);
        }

        return result;
    }, [products]);

    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {uniqueProducts.map((product: any) => (
                    <ProductListItem
                        key={product.id}
                        product={product}
                        formatMoney={formatMoney}
                    />
                ))}
            </div>
        );
    }

    // Determine grid columns based on view mode
    const gridClasses = {
        'grid-2': 'grid grid-cols-1 gap-6 sm:grid-cols-2',
        'grid-3': 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
        'grid-4': 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        'grid-5': 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    }[viewMode];

    return (
        <div className={gridClasses}>
            {uniqueProducts.map((product: any) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    formatMoney={formatMoney}
                />
            ))}
        </div>
    );
}

function ProductCard({
    product,
    formatMoney,
}: {
    product: any;
    formatMoney: any;
}) {
    const image = product.thumbnail ?? product.image ?? product.display_img;
    const hasDiscount = product.mrp && product.price && product.mrp > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    return (
        <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
            {/* Badges */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                {product.is_new && (
                    <span className="rounded bg-[#84d187] px-2 py-1 text-xs font-semibold uppercase text-white">
                        New
                    </span>
                )}
                {hasDiscount && (
                    <span className="rounded bg-secondary px-2 py-1 text-xs font-semibold text-white">
                        -{discountPercent}%
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <WishlistButton productId={product.id} variant="icon" />
                <AddToCartButton productId={product.id} variant="icon" />
                <Link
                    href={route('product.show', product.slug)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-secondary hover:text-white"
                >
                    <Eye className="h-5 w-5" />
                </Link>
            </div>

            {/* Image */}
            <Link
                href={route('product.show', product.slug)}
                className="block overflow-hidden"
            >
                <div className="relative h-64 w-full bg-muted">
                    <img
                        src={image || FALLBACK_IMAGE}
                        alt={product.title}
                        onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                    />
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                {product.category && (
                    <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {product.category.title ?? product.category.name}
                    </p>
                )}
                <Link href={route('product.show', product.slug)}>
                    <h3 className="mb-2 line-clamp-2 text-base font-semibold text-foreground transition-colors hover:text-secondary">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                {product.average_rating !== undefined && (
                    <div className="mb-3">
                        <AverageRating
                            averageRating={product.average_rating}
                            reviewCount={product.review_count}
                            showDistribution={false}
                        />
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                        {formatMoney(product.price, { showDecimals: true })}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                            {formatMoney(product.mrp, { showDecimals: true })}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton productId={product.id} variant="full" className="mt-4" />
            </div>
        </div>
    );
}

function ProductListItem({
    product,
    formatMoney,
}: {
    product: any;
    formatMoney: any;
}) {
    const image = product.thumbnail ?? product.image ?? product.display_img;
    const hasDiscount = product.mrp && product.price && product.mrp > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    return (
        <div className="group flex gap-4 overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:shadow-lg">
            {/* Image */}
            <Link
                href={route('product.show', product.slug)}
                className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg"
            >
                <div className="relative h-full w-full bg-muted">
                    <img
                        src={image || FALLBACK_IMAGE}
                        alt={product.title}
                        onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                    />
                </div>
                {/* Badges */}
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                    {product.is_new && (
                        <span className="rounded bg-[#84d187] px-2 py-0.5 text-xs font-semibold uppercase text-white">
                            New
                        </span>
                    )}
                    {hasDiscount && (
                        <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-white">
                            -{discountPercent}%
                        </span>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col">
                {product.category && (
                    <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {product.category.title ?? product.category.name}
                    </p>
                )}
                <Link href={route('product.show', product.slug)}>
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors hover:text-secondary">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                {product.average_rating !== undefined && (
                    <div className="mb-2">
                        <AverageRating
                            averageRating={product.average_rating}
                            reviewCount={product.review_count}
                            showDistribution={false}
                        />
                    </div>
                )}

                {/* Description */}
                {product.short_description && (
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {product.short_description}
                    </p>
                )}

                {/* Price and Actions */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-foreground">
                            {formatMoney(product.price, { showDecimals: true })}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatMoney(product.mrp, {
                                    showDecimals: true,
                                })}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <WishlistButton productId={product.id} variant="icon" />
                        <AddToCartButton productId={product.id} variant="default" />
                    </div>
                </div>
            </div>
        </div>
    );
}
