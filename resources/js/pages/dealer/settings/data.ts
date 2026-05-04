import type { NavItem } from '@/types';

export const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: route('dealer.profile.edit'),
        icon: null,
    },
    {
        title: 'Password',
        href: route('dealer.password.edit'),
        icon: null,
    },
];
