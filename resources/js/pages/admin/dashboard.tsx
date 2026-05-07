import { Head, usePage } from '@inertiajs/react';
import {
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    AlertTriangle,
    IndianRupee,
} from 'lucide-react';
import { useFormatMoney } from '@/hooks/use-format-money';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [];

interface DashboardProps {
    metrics: {
        products: {
            total: number;
            active: number;
            low_stock: number;
            out_of_stock: number;
        };
        orders: {
            total: number;
            pending: number;
            completed: number;
            revenue: number;
        };
        users: {
            total: number;
            new_this_month: number;
        };
    };
    recentOrders: any[];
    lowStockProducts: any[];
    topProducts: any[];
    [key: string]: any;
}

export default function Dashboard() {
    const { metrics, recentOrders, lowStockProducts, topProducts } =
        usePage<DashboardProps>().props;
    const { formatMoney } = useFormatMoney();

    const statCards = [
        {
            title: 'Total Products',
            value: metrics.products.total,
            subtitle: `${metrics.products.active} active`,
            icon: Package,
            color: 'bg-blue-500',
            href: route('admin.product.index'),
        },
        {
            title: 'Total Orders',
            value: metrics.orders.total,
            subtitle: `${metrics.orders.pending} pending`,
            icon: ShoppingCart,
            color: 'bg-green-500',
            href: route('admin.order.index'),
        },
        {
            title: 'Total Revenue',
            value: formatMoney(metrics.orders.revenue, { showDecimals: true }),
            subtitle: `${metrics.orders.completed} completed`,
            icon: IndianRupee,
            color: 'bg-purple-500',
            href: route('admin.order.index'),
        },
        {
            title: 'Total Users',
            value: metrics.users.total,
            subtitle: `${metrics.users.new_this_month} this month`,
            icon: Users,
            color: 'bg-orange-500',
            href: route('admin.user.index'),
        },
        {
            title: 'Low Stock Alert',
            value: metrics.products.low_stock,
            subtitle: `${metrics.products.out_of_stock} out of stock`,
            icon: AlertTriangle,
            color: 'bg-red-500',
            href: route('admin.product.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {statCards.map((stat, index) => (
                        <a
                            key={index}
                            href={stat.href}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-foreground">
                                        {stat.value}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stat.subtitle}
                                    </p>
                                </div>
                                <div
                                    className={`${stat.color} rounded-lg p-3 text-white transition-transform group-hover:scale-110`}
                                >
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">
                                Recent Orders
                            </h3>
                            <a
                                href={route('admin.order.index')}
                                className="text-sm text-primary hover:underline"
                            >
                                View all
                            </a>
                        </div>
                        <div className="space-y-3">
                            {recentOrders && recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">
                                                {order.user_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.created_at}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-foreground">
                                                {formatMoney(
                                                    order.total_amount,
                                                    {
                                                        showDecimals: true,
                                                    },
                                                )}
                                            </p>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${
                                                    order.status === 'completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : order.status ===
                                                            'pending'
                                                          ? 'bg-yellow-100 text-yellow-700'
                                                          : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No orders yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Products */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Low Stock Alert
                            </h3>
                            <a
                                href={route('admin.product.index')}
                                className="text-sm text-primary hover:underline"
                            >
                                View all
                            </a>
                        </div>
                        <div className="space-y-3">
                            {lowStockProducts && lowStockProducts.length > 0 ? (
                                lowStockProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex-1">
                                            <p className="line-clamp-1 font-medium text-foreground">
                                                {product.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatMoney(product.price, {
                                                    showDecimals: false,
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                    product.stock <= 0
                                                        ? 'bg-red-100 text-red-700'
                                                        : product.stock <= 5
                                                          ? 'bg-orange-100 text-orange-700'
                                                          : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >
                                                {product.stock <= 0
                                                    ? 'Out of stock'
                                                    : `${product.stock} left`}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No stock alerts
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Selling Products - Full Width */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Top Selling Products
                        </h3>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                        {topProducts && topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-1 font-medium text-foreground">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {product.total_sold} sold
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full">
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No sales data yet
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
