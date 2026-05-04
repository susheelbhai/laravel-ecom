import { LayoutGrid, LogOut, Package, Settings, Store, Warehouse } from 'lucide-react';

const mainNavItems = [
    {
        title: 'Dashboard',
        routeName: 'distributor.dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        routeName: 'distributor.products.index',
        icon: Package,
    },
    {
        title: 'Purchase Orders',
        routeName: 'distributor.purchase-orders.index',
        icon: Warehouse,
    },
    {
        title: 'Dealer Orders',
        routeName: 'distributor.dealer-orders.index',
        icon: Store,
    },
    {
        title: 'Dealers',
        routeName: 'distributor.dealer.index',
        icon: Store,
    },
    {
        title: 'Stock',
        routeName: 'distributor.stock.index',
        icon: Warehouse,
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
        routeName: 'distributor.profile.edit',
        icon: Settings,
    },
    {
        title: 'Log Out',
        routeName: 'distributor.logout',
        icon: LogOut,
    },
];

export { footerNavItems, mainNavItems, profileNavItems };
