import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface WishlistButtonProps {
    productId: number;
    variant?: 'default' | 'icon' | 'full';
    className?: string;
    onSuccess?: () => void;
    onError?: (errors: any) => void;
}

export function WishlistButton({
    productId,
    variant = 'default',
    className = '',
    onSuccess,
    onError,
}: WishlistButtonProps) {
    const { wishlistProductIds = [], auth } = usePage().props as any;
    const isInWishlist = wishlistProductIds.includes(productId);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }

        setIsTogglingWishlist(true);

        if (isInWishlist) {
            router.delete(route('wishlist.remove', productId), {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                },
                onError: (errors) => {
                    onError?.(errors);
                },
                onFinish: () => {
                    setIsTogglingWishlist(false);
                },
            });
        } else {
            router.post(
                route('wishlist.add'),
                {
                    product_id: productId,
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
                        setIsTogglingWishlist(false);
                    },
                },
            );
        }
    };

    // Icon variant (circular button with icon only)
    if (variant === 'icon') {
        return (
            <button
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors disabled:opacity-50 ${isInWishlist
                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        : 'bg-card hover:bg-secondary hover:text-white'
                    } ${className}`}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
                <Heart
                    className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`}
                />
            </button>
        );
    }

    // Full variant (full width button)
    if (variant === 'full') {
        return (
            <button
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={`flex w-full items-center justify-center gap-2 rounded-button border-2 px-6 py-3 font-semibold transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${isInWishlist
                        ? 'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        : 'border-border bg-card text-foreground hover:border-destructive hover:text-destructive'
                    } ${className}`}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
                <Heart
                    className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`}
                />
                {isTogglingWishlist
                    ? 'Loading...'
                    : isInWishlist
                        ? 'Remove from Wishlist'
                        : 'Add to Wishlist'}
            </button>
        );
    }

    // Default variant (button with icon and text)
    return (
        <button
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isInWishlist
                    ? 'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'border-border bg-card hover:bg-secondary hover:text-white'
                } ${className}`}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
            <Heart
                className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`}
            />
            {isTogglingWishlist
                ? 'Loading...'
                : isInWishlist
                    ? 'Remove'
                    : 'Add to Wishlist'}
        </button>
    );
}
