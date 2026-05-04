import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
    Edit,
    Trash2,
    Move,
    TrendingUp,
    History,
    ArrowRightLeft,
} from 'lucide-react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import TextLink from '@/components/ui/button/text-link';
import ButtonCreate from '@/components/ui/button/button-create';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Management',
        href: route('admin.stock.dashboard.index'),
    },
    {
        title: 'Stock Records',
        href: '#',
    },
];

export default function StockRecordIndex() {
    const data = (usePage<SharedData>().props as any)?.stockRecords as any;
    const items = data?.data || [];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this stock record?')) {
            router.delete(route('admin.stock.records.destroy', id));
        }
    };

    const getStockStatusBadge = (quantity: number) => {
        if (quantity === 0) {
            return (
                <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
                    Out of Stock
                </span>
            );
        } else if (quantity <= 10) {
            return (
                <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                    Low Stock
                </span>
            );
        }
        return (
            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                In Stock
            </span>
        );
    };

    const thead = [
        { title: 'Product', className: 'p-3' },
        { title: 'Warehouse', className: 'p-3' },
        { title: 'Rack', className: 'p-3' },
        { title: 'Quantity', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Actions', className: 'p-3 text-right' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Records" />
            <ButtonCreate
                href={route('admin.stock.records.create')}
                text="Add Stock Record"
            />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((record: any) => (
                            <tr
                                key={record.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3 font-medium">
                                    {record.product?.title}
                                    <div className="text-xs text-gray-500">
                                        {record.product?.sku}
                                    </div>
                                </td>
                                <td className="p-3">
                                    {record.rack?.warehouse?.name}
                                </td>
                                <td className="p-3">
                                    {record.rack?.identifier}
                                </td>
                                <td className="p-3">{record.quantity}</td>
                                <td className="p-3">
                                    {getStockStatusBadge(record.quantity)}
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <TextLink
                                            href={route(
                                                'admin.stock.records.move.form',
                                                record.id,
                                            )}
                                            title="Move Stock"
                                        >
                                            <ArrowRightLeft className="h-4 w-4" />
                                        </TextLink>
                                        <TextLink
                                            href={route(
                                                'admin.stock.records.adjust.form',
                                                record.id,
                                            )}
                                            title="Adjust Quantity"
                                        >
                                            <TrendingUp className="h-4 w-4" />
                                        </TextLink>
                                        <TextLink
                                            href={route(
                                                'admin.stock.records.history',
                                                record.id,
                                            )}
                                            title="View History"
                                        >
                                            <History className="h-4 w-4" />
                                        </TextLink>
                                        <TextLink
                                            href={route(
                                                'admin.stock.records.edit',
                                                record.id,
                                            )}
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </TextLink>
                                        <button
                                            onClick={() =>
                                                handleDelete(record.id)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                {items.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        No stock records found. Create your first stock record
                        to get started.
                    </div>
                )}
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
