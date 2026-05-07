import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/dealer/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import { useFormatMoney } from '@/hooks/use-format-money';
import OrderSummaryCard from '@/components/order/OrderSummaryCard';
import OrderDetailItem from '@/components/order/OrderDetailItem';
import PaymentSummarySection from '@/components/payment/PaymentSummarySection';

export default function DealerOrderShow() {
    const { data } = usePage<SharedData>().props as any;
    const { formatMoney } = useFormatMoney();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My Orders', href: '/dealer/orders' },
        { title: data?.order_number ?? 'Order', href: '#' },
    ];

    const thead = [
        { title: 'Product', className: 'p-3 sm:p-4' },
        { title: 'Qty', className: 'p-3 text-right sm:p-4' },
        { title: 'Unit price', className: 'p-3 text-right sm:p-4' },
        { title: 'Subtotal', className: 'p-3 text-right sm:p-4' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data?.order_number ?? 'Order'} />

            <div className="w-full space-y-6 p-4">
                <OrderSummaryCard
                    orderNumber={data?.order_number ?? 'Order'}
                    status={data?.status ?? ''}
                >
                    <OrderDetailItem label="Items">
                        {Array.isArray(data?.items) ? data.items.length : 0}
                    </OrderDetailItem>
                    <OrderDetailItem label="Total">{formatMoney(data.total_amount)}</OrderDetailItem>
                    <OrderDetailItem label="Created">{data.created_at}</OrderDetailItem>
                </OrderSummaryCard>

                <TableCard className="min-w-0">
                    <Table className="w-full max-w-full table-fixed">
                        <THead data={thead} />
                        <TBody>
                            {data.items.map((row: any) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-200 odd:bg-gray-50/60 dark:border-gray-800 dark:odd:bg-gray-900/40"
                                >
                                    <td className="p-3 text-gray-900 dark:text-gray-100 sm:p-4">
                                        <div className="break-words font-medium">{row.product_title}</div>
                                    </td>
                                    <td className="p-3 text-right tabular-nums text-gray-900 dark:text-gray-100 sm:p-4">
                                        {row.quantity}
                                    </td>
                                    <td className="p-3 text-right tabular-nums text-gray-700 dark:text-gray-200 sm:p-4">
                                        {formatMoney(row.unit_price)}
                                    </td>
                                    <td className="p-3 text-right font-medium tabular-nums text-gray-900 dark:text-gray-100 sm:p-4">
                                        {formatMoney(row.subtotal)}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t border-gray-200 dark:border-gray-800">
                                <td colSpan={3} className="p-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300 sm:p-4">
                                    Total
                                </td>
                                <td className="p-3 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100 sm:p-4">
                                    {formatMoney(data.total_amount)}
                                </td>
                            </tr>
                        </TBody>
                    </Table>
                </TableCard>

                {data.payment_summary && (
                    <PaymentSummarySection
                        summary={data.payment_summary}
                        storeRoute="dealer.orders.show"
                        storeRouteParams={{}}
                        canAddPayment={false}
                    />
                )}
            </div>
        </AppLayout>
    );
}
