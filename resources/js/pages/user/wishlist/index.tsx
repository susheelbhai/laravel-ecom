import { usePage, Link, router } from '@inertiajs/react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Container } from '@/components/ui/layout/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import {
    handleProductImageError,
    PRODUCT_FALLBACK_IMAGE_URL,
} from '@/lib/product-image-fallback';
import AppLayout from '@/layouts/user/app-layout';

const FALLBACK_IMAGE = PRODUCT_FALLBACK_IMAGE_URL;

const WishlistIndex = () => {
    const { wishlist, cartProductIds = [] } = usePage().props as any;
    const { formatMoney } = useFormatMoney();

    const handleAddToCart = (product: any) => {
        router.post(
            route('cart.add'),
            {
                product_id: product.id,
                quantity: 1,
            },
            {
                onSuccess: () => {
                    // Success message will be shown via flash message
                },
                preserveScroll: true,
            },
        );
    };

    const handleRemove = (productId: number) => {
        router.delete(route('wishlist.remove', productId), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="bg-background">
                <Container className="py-8 lg:py-12">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                                <Heart className="h-6 w-6 fill-secondary text-secondary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    My Wishlist
                                </h1>
                                {wishlist?.items?.length > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        {wishlist.items.length}{' '}
                                        {wishlist.items.length === 1
                                            ? 'item'
                                            : 'items'}{' '}
                                        saved
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {wishlist && wishlist.items && wishlist.items.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlist.items.map((item: any) => {
                                const isInCart = cartProductIds.includes(
                                    item.product.id,
                                );

                                return (
                                    <div
                                        key={item.id}
                                        className="group relative overflow-hidden rounded-div border border-border bg-card transition-all hover:shadow-lg"
                                    >
                                        {/* Remove Button */}
                                        <button
                                            onClick={() =>
                                                handleRemove(item.product.id)
                                            }
                                            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-md backdrop-blur-sm transition-all hover:bg-destructive hover:text-destructive-foreground"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>

                                        {/* Product Image */}
                                        <Link
                                            href={route(
                                                'product.show',
                                                item.product.slug,
                                            )}
                                            className="block"
                                        >
                                            <div className="relative aspect-square overflow-hidden bg-muted">
                                                <img
                                                    src={
                                                        item.product.thumbnail ||
                                                        item.product.image ||
                                                        item.product.display_img ||
                                                        FALLBACK_IMAGE
                                                    }
                                                    alt={item.product.title}
                                                    onError={handleProductImageError}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                        </Link>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <Link
                                                href={route(
                                                    'product.show',
                                                    item.product.slug,
                                                )}
                                                className="block"
                                            >
                                                <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-secondary">
                                                    {item.product.title}
                                                </h3>
                                            </Link>

                                            {/* Price */}
                                            <div className="mb-4">
                                                <span className="text-lg font-bold text-secondary">
                                                    {formatMoney(
                                                        item.product.price,
                                                        {
                                                            showDecimals: true,
                                                        },
                                                    )}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            {isInCart ? (
                                                <Link
                                                    href={route('cart.index')}
                                                    className="flex w-full items-center justify-center gap-2 rounded-div bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    Go to Cart
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleAddToCart(
                                                            item.product,
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-div bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    Add to Cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-div border border-border bg-card p-12 text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Heart className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h2 className="mb-2 text-xl font-semibold text-foreground">
                                Your wishlist is empty
                            </h2>
                            <p className="mb-6 text-muted-foreground">
                                Save items you love to your wishlist and shop
                                them later
                            </p>
                            <Link
                                href={route('product.index')}
                                className="inline-flex items-center gap-2 rounded-div bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </Container>
            </div>
        </AppLayout>
    );
};

export default WishlistIndex;
