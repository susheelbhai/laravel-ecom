import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']> | string | null;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
    permission?: string | string[];
};

export type MenuItem = {
    name: string;
    routeName: string;
};

export type ProfileItem = {
    name: string;
    routeName: string;
    method?: string;
};
