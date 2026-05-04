import { Head, usePage } from '@inertiajs/react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock', href: '/admin/stock/dashboard' },
    { title: 'Dealers', href: '/admin/stock/dealers' },
];

export default function AdminDealerStockIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];

    const thead = [
        { title: 'Name', className: 'p-3' },
        { title: 'Email', className: 'p-3' },
        { title: 'Distributor', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Total Qty', className: 'p-3 text-right' },
        { title: 'Created', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dealer Stock" />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((row: any) => (
                            <tr key={row.id} className="border-t border-gray-200">
                                <td className="p-3">
                                    <a
                                        className="text-blue-600 hover:underline"
                                        href={route('admin.stock.dealers.show', row.id)}
                                    >
                                        {row.name}
                                    </a>
                                </td>
                                <td className="p-3">{row.email}</td>
                                <td className="p-3">{row.distributor_name ?? '—'}</td>
                                <td className="p-3 capitalize">
                                    {row.application_status}
                                </td>
                                <td className="p-3 text-right">
                                    {row.total_quantity}
                                </td>
                                <td className="p-3">{row.created_at}</td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}

