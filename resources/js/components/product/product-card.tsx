import { Link, usePage } from '@inertiajs/react';
import AverageRating from '@/components/review/AverageRating';
import { useFormatMoney } from '@/hooks/use-format-money';
import { AddToCartButton } from './add-to-cart-button';
import { WishlistButton } from './wishlist-button';

const FALLBACK_IMAGE = '/images/no-image.svg';

interface ProductCardProps {
    product: {
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
    };
    lazyLoad?: boolean;
}

export function ProductCard({ product, lazyLoad = true }: ProductCardProps) {
    const { formatMoney } = useFormatMoney();
    const { cartProductIds = [], wishlistProductIds = [] } = usePage().props as any;
    
    const image = product.thumbnail ?? product.image ?? product.display_img;
    const averageRating = product.average_rating ?? product.averageRating ?? 0;
    const reviewCount = product.review_count ?? product.reviewCount ?? 0;
    const inStock = product.in_stock ?? true;
    const isInCart = cartProductIds.includes(product.id);
    const isInWishlist = wishlistProductIds.includes(product.id);

    return (
        <Link
            href={route('product.show', product.slug)}
            className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
        >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                    src={image || FALLBACK_IMAGE}
                    alt={product.title}
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading={lazyLoad ? 'lazy' : 'eager'}
                />

                {/* Out of Stock Overlay */}
                {!inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                            Out of Stock
                        </span>
                    </div>
                )}
                
                {/* Wishlist Button */}
                <div className="absolute right-2 top-2">
                    <WishlistButton productId={product.id} variant="icon" />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-secondary">
                    {product.title}
                </h3>

                {/* Price */}
                <div className="mb-2">
                    <span className="text-lg font-bold text-foreground">
                        {formatMoney(product.price, { showDecimals: true })}
                    </span>
                </div>

                {/* Rating */}
                {reviewCount > 0 ? (
                    <AverageRating
                        averageRating={averageRating}
                        reviewCount={reviewCount}
                        showDistribution={false}
                    />
                ) : (
                    <p className="text-xs text-muted-foreground">
                        No reviews yet
                    </p>
                )}
                
                {/* Add to Cart Button */}
                <div className="mt-3">
                    <AddToCartButton productId={product.id} variant="full" />
                </div>
            </div>
        </Link>
    );
}
