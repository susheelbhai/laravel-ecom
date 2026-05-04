import { LayoutGrid, LogOut, Receipt, Settings, ShoppingCart, Warehouse } from 'lucide-react';

const mainNavItems = [
    {
        title: 'Dashboard',
        routeName: 'dealer.dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Orders',
        routeName: 'dealer.orders.index',
        icon: ShoppingCart,
    },
    {
        title: 'My Stock',
        routeName: 'dealer.stock.index',
        icon: Warehouse,
    },
    {
        title: 'Retail Sales',
        routeName: 'dealer.retail-sales.index',
        icon: Receipt,
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
        routeName: 'dealer.profile.edit',
        icon: Settings,
    },
    {
        title: 'Log Out',
        routeName: 'dealer.logout',
        icon: LogOut,
    },
];

export { footerNavItems, mainNavItems, profileNavItems };
