import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    FaBars,
    FaTimes,
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaDollarSign,
} from 'react-icons/fa';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import CartIcon from '@/components/cart-icon';
import { Container } from '@/components/ui/layout/container';
import WishlistIcon from '@/components/wishlist-icon';
import type { MenuItem, ProfileItem } from '@/types';
import AuthSection from './auth-section';
import TopHeader from './top-header';

const routeExists = (name: string): boolean => {
    try {
        route(name);
        return true;
    } catch {
        return false;
    }
};

export default function Header({
    menuItems,
    profileItems,
    loginRoute,
    cartCount = 0,
    wishlistCount = 0,
}: {
    menuItems: MenuItem[];
    profileItems: ProfileItem[];
    loginRoute: string;
    cartCount?: number;
    wishlistCount?: number;
}) {
    const page = usePage() as any;
    const appData = page.props.appData;
    const user = page.props.auth?.user;
    const loginExists = routeExists(loginRoute);
    const [menuOpen, setMenuOpen] = useState(false);

    const initialSearch = useMemo(() => {
        if (typeof window === 'undefined') return '';
        return new URLSearchParams(window.location.search).get('search') ?? '';
    }, []);

    const [searchValue, setSearchValue] = useState<string>(initialSearch);

    useEffect(() => {
        // Keep the header input in sync with the current URL so a search
        // always remains visible after Inertia navigation/refresh.
        if (typeof window === 'undefined') return;
        const current = new URLSearchParams(window.location.search).get('search') ?? '';
        setSearchValue(current);
    }, [page.url]);

    const availableMenuItems = menuItems.filter((item: MenuItem) =>
        routeExists(item.routeName),
    );

    return (
        <header className="sticky top-0 z-50 bg-header-bg shadow-sm">
            {/* Top Bar */}

            <TopHeader />

            {/* Main Header */}
            <Container className="mx-auto flex items-center justify-between gap-4 px-4 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img
                        src={appData.dark_logo}
                        alt="Logo"
                        className="h-10 w-auto md:h-12"
                    />
                </Link>

                {/* Search Bar */}
                <div className="hidden max-w-xl flex-1 md:flex">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const value = searchValue.trim();
                            if (value) {
                                router.get(
                                    route('product.index'),
                                    { search: value },
                                    {
                                        preserveScroll: true,
                                        replace: true,
                                    },
                                );
                            }
                        }}
                        className="relative w-full"
                    >
                        <input
                            type="text"
                            name="search"
                            placeholder="Search Products..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full rounded-full border border-input bg-input-bg px-4 py-2 pr-10 text-sm text-input-text placeholder:text-input-placeholder focus:border-primary focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4">
                    <div className="hidden max-w-xl flex-1 md:flex md:gap-3">
                        <WishlistIcon count={wishlistCount} user={user} />
                        <CartIcon count={cartCount} />
                    </div>

                    {/* Auth Section */}
                    {loginExists && (
                        <AuthSection
                            profileItems={profileItems}
                            loginRoute={loginRoute}
                        />
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center text-xl text-header-text md:hidden"
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </Container>

            {/* Navigation Bar */}
            <div className="border-t border-border bg-header-bg">
                <Container className="mx-auto flex items-center justify-between px-4 py-3">
                    {/* Desktop Menu */}
                    <nav className="hidden items-center gap-1 text-sm font-medium text-header-text md:flex">
                        {availableMenuItems.map((item: MenuItem) => (
                            <Link
                                key={item.name}
                                href={route(item.routeName)}
                                className="rounded px-3 py-2 transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Contact Info */}
                    <div className="hidden items-center gap-6 text-sm md:flex">
                        <div className="flex items-center gap-2 text-header-text">
                            <FaPhone className="text-primary" />
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">
                                    Call Us
                                </span>
                                <a
                                    href={`tel:${appData.phone}`}
                                    className="font-medium transition-colors hover:text-primary"
                                >
                                    {appData.phone}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-header-text">
                            <FaEnvelope className="text-primary" />
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">
                                    Email Us
                                </span>
                                <a
                                    href={`mailto:${appData.email}`}
                                    className="font-medium transition-colors hover:text-primary"
                                >
                                    {appData.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="border-t border-border bg-header-bg px-4 pb-4 shadow md:hidden">
                    {/* Mobile Search */}
                    <div className="py-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const value = searchValue.trim();
                                if (value) {
                                    router.get(
                                        route('product.index'),
                                        { search: value },
                                        {
                                            preserveScroll: true,
                                            replace: true,
                                        },
                                    );
                                }
                                setMenuOpen(false);
                            }}
                        >
                            <input
                                type="text"
                                name="search"
                                placeholder="Search Products..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full rounded-full border border-input bg-input-bg px-4 py-2 text-sm text-input-text placeholder:text-input-placeholder focus:border-primary focus:outline-none"
                            />
                        </form>
                    </div>

                    <nav className="flex flex-col space-y-1.5 text-sm font-medium text-header-text">
                        {availableMenuItems.map((item: MenuItem) => (
                            <Link
                                key={item.name}
                                href={route(item.routeName)}
                                className="rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-primary"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {loginExists && (
                            <div className="flex justify-between border-t">
                                <div className="">
                                    <AuthSection
                                        profileItems={profileItems}
                                        loginRoute={loginRoute}
                                        isMobile
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <WishlistIcon
                                        count={wishlistCount}
                                        user={user}
                                        onLinkClick={() => setMenuOpen(false)}
                                    />
                                    <CartIcon
                                        count={cartCount}
                                        onLinkClick={() => setMenuOpen(false)}
                                    />
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
