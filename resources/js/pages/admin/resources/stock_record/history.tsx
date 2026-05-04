import { Head, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowRight,
    ArrowLeft,
    Settings,
    History,
} from 'lucide-react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import TextLink from '@/components/ui/button/text-link';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Management',
        href: route('admin.stock.dashboard.index'),
    },
    {
        title: 'Stock Records',
        href: route('admin.stock.records.index'),
    },
    {
        title: 'Movement History',
        href: '#',
    },
];

export default function StockRecordHistory() {
    const { stockRecord, movements: data } = usePage<SharedData>().props as any;
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
        { title: 'Type', className: 'p-3' },
        { title: 'Quantity', className: 'p-3' },
        { title: 'Reason', className: 'p-3' },
        { title: 'Created By', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Movement History" />

            <div className="mb-6 rounded-lg border bg-white p-6">
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-indigo-100 p-3">
                        <History className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Movement History</h1>
                        <div className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                            <div>
                                <span className="text-gray-600">Product:</span>{' '}
                                <span className="font-medium">
                                    {stockRecord.product?.title}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">
                                    Warehouse:
                                </span>{' '}
                                <span className="font-medium">
                                    {stockRecord.rack?.warehouse?.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Rack:</span>{' '}
                                <span className="font-medium">
                                    {stockRecord.rack?.identifier}
                                </span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-gray-600">
                                Current Stock:
                            </span>{' '}
                            <span className="text-lg font-bold text-blue-600">
                                {stockRecord.quantity}
                            </span>
                        </div>
                    </div>
                    <div>
                        <TextLink
                            href={route('admin.stock.records.index')}
                            className="text-sm"
                        >
                            ← Back to Stock Records
                        </TextLink>
                    </div>
                </div>
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
                                    {movement.created_by?.name || 'System'}
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                {items.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        No movement history found for this stock record.
                    </div>
                )}
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
