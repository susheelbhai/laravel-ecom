import { router, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
    productId: number;
    quantity?: number;
    variant?: 'default' | 'icon' | 'full';
    className?: string;
    onSuccess?: () => void;
    onError?: (errors: any) => void;
}

export function AddToCartButton({
    productId,
    quantity = 1,
    variant = 'default',
    className = '',
    onSuccess,
    onError,
}: AddToCartButtonProps) {
    const { cartProductIds = [] } = usePage().props as any;
    const isInCart = cartProductIds.includes(productId);
    const [isAddingToCart, setIsAddingToCart] = useState(false);


    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isInCart) {
            router.visit(route('cart.index'));
            return;
        }

        setIsAddingToCart(true);
        router.post(
            route('cart.add'),
            {
                product_id: productId,
                quantity,
            },
            {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                },
                onError: (errors) => {
                    onError?.(errors);
                },
                onFinish: () => {
                    setIsAddingToCart(false);
                },
            },
        );
    };

    // Icon variant (circular button with icon only)
    if (variant === 'icon') {
        return (
            <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors disabled:opacity-50 ${
                    isInCart
                        ? 'bg-secondary text-white hover:bg-secondary/90'
                        : 'bg-white hover:bg-secondary hover:text-white'
                } ${className}`}
                title={isInCart ? 'Go to Cart' : 'Add to Cart'}
            >
                <ShoppingCart className="h-5 w-5" />
            </button>
        );
    }

    // Full variant (full width button)
    if (variant === 'full') {
        return (
            <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex w-full items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    isInCart
                        ? 'bg-secondary text-white hover:bg-secondary/90'
                        : 'bg-secondary text-white hover:bg-secondary/90'
                } ${className}`}
            >
                <ShoppingCart className="h-4 w-4" />
                {isAddingToCart
                    ? 'Adding...'
                    : isInCart
                      ? 'Go to Cart'
                      : 'Add To Cart'}
            </button>
        );
    }

    // Default variant (button with icon and text)
    return (
        <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`flex items-center justify-center gap-2 rounded-button px-6 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isInCart
                    ? 'bg-secondary text-white hover:bg-secondary/90'
                    : 'bg-secondary text-white hover:bg-secondary/90'
            } ${className}`}
        >
            <ShoppingCart className="h-4 w-4" />
            {isAddingToCart
                ? 'Adding...'
                : isInCart
                  ? 'Go to Cart'
                  : 'Add To Cart'}
        </button>
    );
}
