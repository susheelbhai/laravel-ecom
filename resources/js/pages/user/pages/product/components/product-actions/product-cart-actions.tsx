import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Zap } from 'lucide-react';
import { useState } from 'react';
import ProductWishlistButton from './product-wishlist-button';

interface ProductCartActionsProps {
    productId: number;
    price: number;
    hasPrice: boolean;
}

export default function ProductCartActions({
    productId,
    price,
    hasPrice,
}: ProductCartActionsProps) {
    const { cartProductIds = [] } = usePage().props as any;
    const isInCart = cartProductIds.includes(productId);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const addToCart = async () => {
        setIsAddingToCart(true);
        try {
            await router.post(
                route('cart.add'),
                {
                    product_id: productId,
                    quantity: 1,
                },
                {
                    onSuccess: () => {
                        // Success message will be shown via flash message
                    },
                    onError: () => {
                        // Error handling
                    },
                    onFinish: () => {
                        setIsAddingToCart(false);
                    },
                },
            );
        } catch (error) {
            setIsAddingToCart(false);
        }
    };

    const buyNow = () => {
        // Add to cart and redirect to cart page
        router.post(
            route('cart.add'),
            {
                product_id: productId,
                quantity: 1,
            },
            {
                onSuccess: () => {
                    router.visit(route('cart.index'));
                },
            },
        );
    };

    if (!hasPrice) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3">
            {isInCart ? (
                <Link
                    href={route('cart.index')}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-div bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg"
                >
                    <ShoppingCart className="h-5 w-5" />
                    Go to Cart
                </Link>
            ) : (
                <button
                    onClick={addToCart}
                    disabled={isAddingToCart}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-button bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
            )}

            <button
                onClick={buyNow}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-button border-2 border-primary bg-white px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg"
            >
                <Zap className="h-5 w-5" />
                Buy Now
            </button>

            <ProductWishlistButton productId={productId} />
        </div>
    );
}
