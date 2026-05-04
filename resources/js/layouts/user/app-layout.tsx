
import { Head, usePage } from "@inertiajs/react";
import { type ReactNode } from "react";
import { type BreadcrumbItem, type SharedData } from "@/types";
import { menuItems, profileItems, loginRoute } from "../../../data/js/header_user";
import AppLayoutTemplate from "../../themes/guest_default/app/app-header-layout";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const page = usePage<SharedData>();
    const { user } = page.props as unknown as { user?: { name: string; email: string } };

const appData = (page.props as unknown as { appData?: { name?: string } }).appData;
    const appName = appData?.name ?? page.props.name ?? "App";
    const seo = page.props.seo;
    const fullTitle = `${seo?.title} - ${appName}`;
    const description = seo?.description;
    const canonicalUrl = seo?.canonicalUrl;
    // Get cart and wishlist counts for all users (authenticated and guests)
    const cartCount = (page.props as any).cartCount || 0;
    const wishlistCount = (page.props as any).wishlistCount || 0;
    return (
        <AppLayoutTemplate
            authUser={user}
            menuItems={menuItems}
            profileItems={profileItems}
            loginRoute={loginRoute}
            breadcrumbs={breadcrumbs}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            {...props}
        >
            <Head title={fullTitle} />
            <Head>

                <meta head-key="og:title" property="og:title" content={fullTitle} />
                <meta head-key="twitter:title" name="twitter:title" content={fullTitle} />
            </Head>
            {canonicalUrl && (
                <Head>
                    <link head-key="canonical" rel="canonical" href={canonicalUrl} />
                    <meta head-key="og:url" property="og:url" content={canonicalUrl} />
                </Head>
            )}

            {description && (
                <Head>
                    <meta head-key="description" name="description" content={description} />
                    <meta head-key="og:description" property="og:description" content={description} />
                    <meta head-key="twitter:description" name="twitter:description" content={description} />
                </Head>
            )}
            {children}
        </AppLayoutTemplate>
    );
};
