
import { usePage } from "@inertiajs/react";
import { type ReactNode } from "react";
import { type BreadcrumbItem, type SharedData } from "@/types";
import { menuItems, profileItems, loginRoute } from "../../../data/js/header_user";
import AppLayoutTemplate from "../../themes/guest_default/app/app-header-layout";
import { Link } from '@inertiajs/react';
import { Container } from "@/components/ui/layout/container";


interface AppLayoutProps {
    children: ReactNode;
    title: ReactNode;
    description: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, title, description, breadcrumbs, ...props }: AppLayoutProps) => {
    const page = usePage<SharedData>();
    const { user } = page.props as unknown as { user?: { name: string; email: string } };

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

            {/* ── Top bar ── */}
            <div className="border-b border-border bg-background py-4">
                <Container>
                    
                    <Link
                        href={route('technician.login')}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        Already registered? <span className="font-medium text-primary">Sign in</span>
                    </Link>
                </Container>
            </div>

            {/* ── Page heading ── */}
            <div className="bg-background border-b border-border py-6">
                <Container>
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    {description && (
                        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
                    )}
                </Container>
            </div>
            
            
            {children}
        </AppLayoutTemplate>
    );
};
