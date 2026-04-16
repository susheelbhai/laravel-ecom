import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductWishlistButtonProps {
    productId: number;
}

export default function ProductWishlistButton({
    productId,
}: ProductWishlistButtonProps) {
    const { wishlistProductIds = [], auth } = usePage().props as any;
    const isInWishlist = wishlistProductIds.includes(productId);
    const [isLoading, setIsLoading] = useState(false);

    const toggleWishlist = async () => {
        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }

        setIsLoading(true);
        try {
            if (isInWishlist) {
                await router.delete(route('wishlist.remove', productId), {
                    onFinish: () => {
                        setIsLoading(false);
                    },
                });
            } else {
                await router.post(
                    route('wishlist.add'),
                    {
                        product_id: productId,
                    },
                    {
                        onFinish: () => {
                            setIsLoading(false);
                        },
                    },
                );
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={isLoading}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-6 py-3 font-semibold transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${
                isInWishlist
                    ? 'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'border-border bg-card text-foreground hover:border-destructive hover:text-destructive'
            }`}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
            <Heart
                className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`}
            />
            {isLoading
                ? 'Loading...'
                : isInWishlist
                  ? 'Remove from Wishlist'
                  : 'Add to Wishlist'}
        </button>
    );
}
