import { Head, usePage } from '@inertiajs/react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

export default function AdminDealerStockShow() {
    const { owner, data } = usePage<SharedData>().props as any;
    const items = data?.data || [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Stock', href: '/admin/stock/dashboard' },
        { title: 'Dealers', href: '/admin/stock/dealers' },
        { title: owner?.name ?? 'Dealer', href: '#' },
    ];

    const thead = [
        { title: 'Product', className: 'p-3' },
        { title: 'SKU', className: 'p-3' },
        { title: 'Qty', className: 'p-3 text-right' },
        { title: 'Warehouse', className: 'p-3' },
        { title: 'Rack', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Stock - ${owner?.name ?? ''}`} />

            <div className="mb-4 text-sm text-gray-600">
                Dealer: {owner?.name} {owner?.email ? `(${owner.email})` : ''}
            </div>

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((row: any) => (
                            <tr key={row.id} className="border-t border-gray-200">
                                <td className="p-3">{row.product_title}</td>
                                <td className="p-3">{row.sku ?? '—'}</td>
                                <td className="p-3 text-right">{row.quantity}</td>
                                <td className="p-3">{row.warehouse ?? '—'}</td>
                                <td className="p-3">{row.rack ?? '—'}</td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}

