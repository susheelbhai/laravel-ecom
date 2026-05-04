import type { NavItem } from '@/types';

export const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: route('distributor.profile.edit'),
        icon: null,
    },
    {
        title: 'Password',
        href: route('distributor.password.edit'),
        icon: null,
    },
];
