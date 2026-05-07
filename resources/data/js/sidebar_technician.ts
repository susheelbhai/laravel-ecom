import { LayoutGrid, LogOut, Settings } from 'lucide-react';

const mainNavItems = [
    {
        title: 'Dashboard',
        routeName: 'technician.dashboard',
        icon: LayoutGrid,
    },
];

interface NavItem {
    title: string;
    routeName?: string;
    href?: string | null;
    icon: React.ComponentType;
    permission?: string[];
    children?: NavItem[];
}

const footerNavItems: NavItem[] = [];
const profileNavItems = [
    {
        title: 'Settings',
        routeName: 'technician.profile.edit',
        icon: Settings,
    },
    {
        title: 'Log Out',
        routeName: 'technician.logout',
        icon: LogOut,
    },
];

export { footerNavItems, mainNavItems, profileNavItems };
