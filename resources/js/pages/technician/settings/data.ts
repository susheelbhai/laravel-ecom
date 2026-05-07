import type { NavItem } from '@/types';

export const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: route('technician.profile.edit'),
        icon: null,
    },
    {
        title: 'Password',
        href: route('technician.password.edit'),
        icon: null,
    },
];
