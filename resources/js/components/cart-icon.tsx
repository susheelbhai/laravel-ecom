import { Link } from '@inertiajs/react';
import { FaShoppingCart } from 'react-icons/fa';

interface CartIconProps {
    count?: number;
    showLabel?: boolean;
    onLinkClick?: () => void;
}

export default function CartIcon({
    count = 0,
    showLabel = false,
    onLinkClick,
}: CartIconProps) {
    return (
        <Link
            href={route('cart.index')}
            className="relative flex items-center text-header-text transition-colors hover:text-primary"
            onClick={onLinkClick}
        >
            <FaShoppingCart className={`text-xl ${showLabel ? 'mr-2' : ''}`} />
            {showLabel && 'Cart'}
            {count > 0 && (
                <span
                    className={`${showLabel ? 'ml-2' : 'absolute -top-2 -right-2'} flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white`}
                >
                    {count}
                </span>
            )}
        </Link>
    );
}
