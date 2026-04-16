import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useEffect, useState, type ReactNode } from 'react';
import type { FlashType } from '@/components/ui/alert/flash1';
import { FlashMessage } from '@/components/ui/alert/flash1';
import { ScrollToTopButton } from "@/components/ui/navigation/scroll-to-top-button";
import {
    type BreadcrumbItem,
    type SharedData,
    type MenuItem,
    type ProfileItem,
} from '@/types';
import Footer from './app-footer';
import Header from './header';

export default function AppHeaderLayout({
    children,
    menuItems,
    profileItems,
    loginRoute,
    cartCount,
    wishlistCount,
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    authUser?: any;
    footerNavItems?: any;
    mainNavItems?: any;
    profileNavItems?: any;
    menuItems: MenuItem[];
    profileItems: ProfileItem[];
    loginRoute: string;
    cartCount?: number;
    wishlistCount?: number;
}>) {
    const page = usePage<SharedData>();
    const { flash = {} } = page.props as {
        flash?: Partial<Record<FlashType, string>>;
    };

    const [visibleFlash, setVisibleFlash] = useState<{
        type: FlashType;
        message: string;
    } | null>(null);

    // 🔁 Handle flash on every Inertia response
    useEffect(() => {
        if (flash.success) {
            setVisibleFlash({ type: 'success', message: flash.success });
        } else if (flash.warning) {
            setVisibleFlash({ type: 'warning', message: flash.warning });
        } else if (flash.error) {
            setVisibleFlash({ type: 'error', message: flash.error });
        } else {
            setVisibleFlash(null);
        }

        // ⏱ Auto-hide after 3 seconds if any flash is present
        if (flash.success || flash.warning || flash.error) {
            const timer = setTimeout(() => setVisibleFlash(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);
    return (
        <div className="overflow-x-hidden bg-background text-foreground">
            <header className="w-full">
                <Header
                    menuItems={menuItems}
                    profileItems={profileItems}
                    loginRoute={loginRoute}
                    cartCount={cartCount}
                    wishlistCount={wishlistCount}
                />
            </header>

            <div className="mx-auto items-center justify-between">
                {visibleFlash && (
                    <FlashMessage
                        type={visibleFlash.type}
                        message={visibleFlash.message}
                        onClose={() => setVisibleFlash(null)}
                    />
                )}
            </div>
            {children}

            <Footer />
            <ScrollToTopButton variant="ring" />
        </div>
    );
}
