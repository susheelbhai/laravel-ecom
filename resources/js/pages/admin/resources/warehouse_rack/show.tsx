import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/admin/app-layout';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import SerialsModal from '@/components/Stock/SerialsModal';
import { type BreadcrumbItem, type SharedData } from '@/types';

export default function RackShow() {
    const { rack, stockRecords } = usePage<SharedData>().props as any;

    const [modalData, setModalData] = useState<{ productTitle: string; serials: string[] } | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Stock Management', href: route('admin.stock.dashboard.index') },
        { title: 'Warehouses', href: route('admin.stock.warehouses.index') },
        { title: rack?.warehouse?.name ?? 'Warehouse', href: route('admin.stock.warehouses.racks.index', rack?.warehouse?.id) },
        { title: rack?.identifier ?? 'Rack', href: '#' },
    ];

    const thead = [
        { title: 'Product', className: 'p-3' },
        { title: 'SKU', className: 'p-3' },
        { title: 'Quantity', className: 'p-3' },
        { title: 'Serial Numbers', className: 'p-3' },
    ];

    const items: any[] = stockRecords ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rack: ${rack?.identifier}`} />

            {/* Rack header */}
            <div className="mb-4 rounded-div border border-border bg-card p-4 shadow-sm">
                <div className="flex items-baseline gap-3">
                    <h1 className="text-xl font-semibold">{rack?.identifier}</h1>
                    <span className="text-sm text-muted-foreground">{rack?.warehouse?.name}</span>
                </div>
                {rack?.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{rack.description}</p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                    {items.length} product type{items.length !== 1 ? 's' : ''} ·{' '}
                    {items.reduce((sum: number, r: any) => sum + r.quantity, 0)} total units
                </p>
            </div>

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((record: any) => {
                            const serials: string[] = record.serial_numbers ?? [];
                            return (
                                <tr key={record.id} className="border-t border-gray-200">
                                    <td className="p-3 font-medium">{record.product?.title}</td>
                                    <td className="p-3 font-mono text-sm text-gray-500">
                                        {record.product?.sku ?? '—'}
                                    </td>
                                    <td className="p-3">{record.quantity}</td>
                                    <td className="p-3">
                                        {serials.length > 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => setModalData({
                                                    productTitle: record.product?.title ?? '',
                                                    serials,
                                                })}
                                                className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 focus:outline-none"
                                            >
                                                {serials.length} serial{serials.length !== 1 ? 's' : ''}
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">No serials</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </TBody>
                </Table>
                {items.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        This rack has no available stock.
                    </div>
                )}
            </TableCard>

            {modalData && (
                <SerialsModal
                    open={true}
                    onClose={() => setModalData(null)}
                    productTitle={modalData.productTitle}
                    serials={modalData.serials}
                    lookupRoute={route('admin.serial-numbers.lookup')}
                />
            )}
        </AppLayout>
    );
}
