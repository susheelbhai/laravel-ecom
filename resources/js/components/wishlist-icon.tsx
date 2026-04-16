import { Link } from '@inertiajs/react';
import { FaHeart } from 'react-icons/fa';

interface WishlistIconProps {
    count?: number;
    showLabel?: boolean;
    user?: any;
    onLinkClick?: () => void;
}

export default function WishlistIcon({
    count = 0,
    showLabel = false,
    user,
    onLinkClick,
}: WishlistIconProps) {
    return (
        <Link
            href={user ? route('wishlist.index') : route('login')}
            className="relative flex items-center text-header-text transition-colors hover:text-primary"
            onClick={onLinkClick}
        >
            <FaHeart className={`text-xl ${showLabel ? 'mr-2' : ''}`} />
            {showLabel && 'Wishlist'}
            {user && count > 0 && (
                <span
                    className={`${showLabel ? 'ml-2' : 'absolute -top-2 -right-2'} flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white`}
                >
                    {count}
                </span>
            )}
        </Link>
    );
}
