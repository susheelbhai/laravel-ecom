import { Head, usePage } from '@inertiajs/react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/distributor/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { useFormatMoney } from '@/hooks/use-format-money';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/distributor/products' },
];

export default function DistributorProductsIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];
    const { formatMoney } = useFormatMoney();

    const thead = [
        { title: 'ID', className: 'p-3' },
        { title: 'Title', className: 'p-3' },
        { title: 'SKU', className: 'p-3' },
        { title: 'Distributor Price', className: 'p-3 text-right' },
        { title: 'MRP', className: 'p-3 text-right' },
        { title: 'Stock Managed', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((row: any) => (
                            <tr key={row.id} className="border-t border-gray-200">
                                <td className="p-3">{row.id}</td>
                                <td className="p-3">{row.title}</td>
                                <td className="p-3">{row.sku ?? '—'}</td>
                                <td className="p-3 text-right">
                                    {formatMoney(
                                        row.distributor_price ?? row.price ?? 0,
                                    )}
                                </td>
                                <td className="p-3 text-right">
                                    {row.mrp != null ? formatMoney(row.mrp) : '—'}
                                </td>
                                <td className="p-3">
                                    {row.manage_stock ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}

