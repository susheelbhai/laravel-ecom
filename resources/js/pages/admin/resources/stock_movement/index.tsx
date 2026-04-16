import { Head, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowRight,
    ArrowLeft,
    Settings,
} from 'lucide-react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Management',
        href: route('admin.stock.dashboard.index'),
    },
    {
        title: 'Stock Movements',
        href: '#',
    },
];

export default function StockMovementIndex() {
    const data = (usePage<SharedData>().props as any)?.movements as any;
    const items = data?.data || [];

    const getMovementIcon = (type: string) => {
        switch (type) {
            case 'in':
                return <ArrowDown className="h-4 w-4 text-green-600" />;
            case 'out':
                return <ArrowUp className="h-4 w-4 text-red-600" />;
            case 'transfer_in':
                return <ArrowRight className="h-4 w-4 text-blue-600" />;
            case 'transfer_out':
                return <ArrowLeft className="h-4 w-4 text-orange-600" />;
            case 'adjustment':
                return <Settings className="h-4 w-4 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getMovementBadge = (type: string) => {
        const badges: Record<
            string,
            { bg: string; text: string; label: string }
        > = {
            in: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                label: 'Stock In',
            },
            out: { bg: 'bg-red-100', text: 'text-red-800', label: 'Stock Out' },
            transfer_in: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                label: 'Transfer In',
            },
            transfer_out: {
                bg: 'bg-orange-100',
                text: 'text-orange-800',
                label: 'Transfer Out',
            },
            adjustment: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                label: 'Adjustment',
            },
        };

        const badge = badges[type] || {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            label: type,
        };

        return (
            <span
                className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${badge.bg} ${badge.text}`}
            >
                {getMovementIcon(type)}
                {badge.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const thead = [
        { title: 'Date & Time', className: 'p-3' },
        { title: 'Product', className: 'p-3' },
        { title: 'Warehouse', className: 'p-3' },
        { title: 'Rack', className: 'p-3' },
        { title: 'Type', className: 'p-3' },
        { title: 'Quantity', className: 'p-3' },
        { title: 'Reason', className: 'p-3' },
        { title: 'Created By', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Movements" />

            <div className="mb-4">
                <h1 className="text-2xl font-bold">Stock Movements</h1>
                <p className="text-gray-600">
                    View all stock movement transactions and history
                </p>
            </div>

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((movement: any) => (
                            <tr
                                key={movement.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3 text-sm">
                                    {formatDate(movement.created_at)}
                                </td>
                                <td className="p-3 font-medium">
                                    {movement.product?.title}
                                    <div className="text-xs text-gray-500">
                                        {movement.product?.sku}
                                    </div>
                                </td>
                                <td className="p-3">
                                    {movement.rack?.warehouse?.name}
                                </td>
                                <td className="p-3">
                                    {movement.rack?.identifier}
                                </td>
                                <td className="p-3">
                                    {getMovementBadge(movement.type)}
                                </td>
                                <td className="p-3 font-semibold">
                                    {movement.type === 'adjustment'
                                        ? movement.quantity
                                        : `${movement.type === 'out' || movement.type === 'transfer_out' ? '-' : '+'}${movement.quantity}`}
                                </td>
                                <td className="p-3 text-sm text-gray-600">
                                    {movement.reason || '-'}
                                </td>
                                <td className="p-3 text-sm">
                                    {movement.created_by
                                        ? movement.created_by.name
                                        : 'System'}
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                {items.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        No stock movements found.
                    </div>
                )}
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
