import { Head, usePage } from '@inertiajs/react';
import { Warehouse, Package, AlertTriangle } from 'lucide-react';
import TextLink from '@/components/ui/button/text-link';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Management',
        href: route('admin.stock.dashboard.index'),
    },
];

export default function StockDashboard() {
    const {
        totalWarehouses,
        totalRacks,
        totalProductsInStock,
        lowStockAlerts,
    } = usePage<SharedData>().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-div ">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-div border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Warehouses
                                </p>
                                <p className="mt-2 text-3xl font-bold">
                                    {totalWarehouses || 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-500 p-3">
                                <Warehouse className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <TextLink
                                href={route('admin.stock.warehouses.index')}
                            >
                                View All →
                            </TextLink>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-div border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Racks
                                </p>
                                <p className="mt-2 text-3xl font-bold">
                                    {totalRacks || 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-green-500 p-3">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-div border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Products in Stock
                                </p>
                                <p className="mt-2 text-3xl font-bold">
                                    {totalProductsInStock || 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-500 p-3">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <TextLink href={route('admin.stock.records.index')}>
                                View All →
                            </TextLink>
                        </div>
                    </div>
                </div>

                {lowStockAlerts && lowStockAlerts.length > 0 && (
                    <div className="relative overflow-hidden rounded-div border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border">
                        <div className="mb-4 flex items-center">
                            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                            <h2 className="text-xl font-semibold">
                                Low Stock Alerts ({lowStockAlerts.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="p-3 text-left">
                                            Product
                                        </th>
                                        <th className="p-3 text-left">
                                            Location
                                        </th>
                                        <th className="p-3 text-left">
                                            Quantity
                                        </th>
                                        <th className="p-3 text-left">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockAlerts.map((alert: any) => (
                                        <tr key={alert.id} className="border-b">
                                            <td className="p-3">
                                                {alert.product?.title}
                                                <div className="text-xs text-gray-500">
                                                    {alert.product?.sku}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {alert.rack?.warehouse?.name} -{' '}
                                                {alert.rack?.identifier}
                                            </td>
                                            <td className="p-3">
                                                {alert.quantity}
                                            </td>
                                            <td className="p-3">
                                                <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                                    Low Stock
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
