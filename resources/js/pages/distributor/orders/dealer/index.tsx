import { Head, usePage } from '@inertiajs/react';
import ButtonCreate from '@/components/ui/button/button-create';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/distributor/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { useFormatMoney } from '@/hooks/use-format-money';
import PaymentStatusBadge from '@/components/payment/PaymentStatusBadge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dealer Orders', href: '/distributor/dealer-orders' },
];

export default function DistributorDealerOrdersIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];
    const { formatMoney } = useFormatMoney();

    const thead = [
        { title: 'ID', className: 'p-3' },
        { title: 'Order #', className: 'p-3' },
        { title: 'Dealer', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Total', className: 'p-3 text-right' },
        { title: 'Payment Status', className: 'p-3' },
        { title: 'Remaining Balance', className: 'p-3 text-right' },
        { title: 'Created', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dealer Orders" />

            <ButtonCreate
                href={route('distributor.dealer-orders.create')}
                text="Create dealer order"
            />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((row: any) => (
                            <tr key={row.id} className="border-t border-gray-200">
                                <td className="p-3">{row.id}</td>
                                <td className="p-3">
                                    <a
                                        className="text-blue-600 hover:underline"
                                        href={route('distributor.dealer-orders.show', row.id)}
                                    >
                                        {row.order_number}
                                    </a>
                                </td>
                                <td className="p-3">{row.dealer_name ?? '—'}</td>
                                <td className="p-3 capitalize">{row.status}</td>
                                <td className="p-3 text-right">
                                    {formatMoney(row.total_amount)}
                                </td>
                                <td className="p-3">
                                    <PaymentStatusBadge status={row.payment_status ?? 'unpaid'} />
                                </td>
                                <td className="p-3 text-right tabular-nums">
                                    {formatMoney(row.remaining_balance ?? row.total_amount)}
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

