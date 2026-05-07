import { AlertTriangle, LayoutGrid, LogOut, Receipt, Settings, ShoppingCart, Warehouse } from 'lucide-react';

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
    {
        title: 'Serial Numbers',
        icon: AlertTriangle,
        children: [
            {
                title: 'Lookup',
                routeName: 'dealer.serial-numbers.lookup',
                icon: AlertTriangle,
            },
            {
                title: 'Damaged',
                routeName: 'dealer.serial-numbers.damaged',
                icon: AlertTriangle,
            },
            {
                title: 'Stolen',
                routeName: 'dealer.serial-numbers.stolen',
                icon: AlertTriangle,
            },
        ],
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
