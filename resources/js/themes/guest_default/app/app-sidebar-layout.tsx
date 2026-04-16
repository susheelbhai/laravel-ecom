import type { PropsWithChildren } from 'react';
import type { BreadcrumbItem, MenuItem, ProfileItem } from '@/types';
import Footer from './app-footer';
import Header from './header';
import TopHeader from './top-header';

export default function AppSidebarLayout({
    children,
    menuItems,
    profileItems,
    loginRoute,
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    authUser?: any;
    footerNavItems?: any;
    mainNavItems?: any;
    profileNavItems?: any;
    menuItems: MenuItem[];
    profileItems: ProfileItem[];
    loginRoute: string;
}>) {
    return (
        <div className="overflow-x-hidden bg-background text-foreground">
            <header className="w-full">
                <TopHeader />
                <Header
                    menuItems={menuItems}
                    profileItems={profileItems}
                    loginRoute={loginRoute}
                />
            </header>

            {children}

            <Footer />
        </div>
    );
}
