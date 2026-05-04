import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/dealer/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import { useFormatMoney } from '@/hooks/use-format-money';

export default function DealerRetailSaleShow() {
    const { data } = usePage<SharedData>().props as any;
    const { formatMoney } = useFormatMoney();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Retail Sales', href: '/dealer/retail-sales' },
        { title: data?.sale_number ?? 'Sale', href: '#' },
    ];

    const status = String(data?.status ?? '').toLowerCase();
    const statusUi: Record<string, { label: string; className: string }> = {
        completed: {
            label: 'Completed',
            className:
                'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
        },
        pending: {
            label: 'Pending',
            className:
                'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
        },
        cancelled: {
            label: 'Cancelled',
            className:
                'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
        },
    };
    const statusMeta = statusUi[status] ?? {
        label: data?.status ?? '—',
        className:
            'bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-200 dark:ring-gray-500/30',
    };

    const thead = [
        { title: 'Product', className: 'p-3 sm:p-4' },
        { title: 'Qty', className: 'p-3 text-right sm:p-4' },
        { title: 'Unit price', className: 'p-3 text-right sm:p-4' },
        { title: 'Subtotal', className: 'p-3 text-right sm:p-4' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data?.sale_number ?? 'Sale'} />

            <div className="w-full space-y-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Retail sale
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                                {data?.sale_number ?? 'Sale'}
                            </h1>
                            <span
                                className={[
                                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                                    statusMeta.className,
                                ].join(' ')}
                            >
                                {statusMeta.label}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Created <span className="font-medium">{data.created_at}</span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatMoney(data.total_amount, { showDecimals: true })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:col-span-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Bill to / warranty contact
                        </div>
                        {data.customer_name ? (
                            <dl className="mt-3 grid gap-2 text-sm text-gray-700 dark:text-gray-200 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {data.customer_name}
                                    </div>
                                </div>
                                {data.customer_email ? (
                                    <div className="truncate">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Email
                                        </div>
                                        <div className="font-medium">{data.customer_email}</div>
                                    </div>
                                ) : null}
                                {data.customer_phone ? (
                                    <div className="truncate">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Phone
                                        </div>
                                        <div className="font-medium">{data.customer_phone}</div>
                                    </div>
                                ) : null}
                                <div className="sm:col-span-2">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Address
                                    </div>
                                    <div className="mt-1 whitespace-pre-line font-medium">
                                        {[
                                            data.billing_address_line1,
                                            data.billing_address_line2,
                                            [data.billing_city, data.billing_state, data.billing_pincode]
                                                .filter(Boolean)
                                                .join(', '),
                                            data.billing_country,
                                        ]
                                            .filter(Boolean)
                                            .join('\n')}
                                    </div>
                                </div>
                                {data.customer_gstin ? (
                                    <div className="sm:col-span-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            GSTIN
                                        </div>
                                        <div className="font-medium">{data.customer_gstin}</div>
                                    </div>
                                ) : null}
                            </dl>
                        ) : (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                No customer billing was captured for this sale.
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Summary
                        </div>
                        <div className="mt-3 space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-600 dark:text-gray-300">Items</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {Array.isArray(data?.items) ? data.items.length : 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-600 dark:text-gray-300">
                                    Total amount
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {formatMoney(data.total_amount, { showDecimals: true })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

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
                                        <div className="break-words font-medium">
                                            {row.product_title}
                                        </div>
                                    </td>
                                    <td className="p-3 text-right text-gray-900 dark:text-gray-100 tabular-nums sm:p-4">
                                        {row.quantity}
                                    </td>
                                    <td className="p-3 text-right text-gray-700 dark:text-gray-200 tabular-nums sm:p-4">
                                        {formatMoney(row.unit_price, { showDecimals: true })}
                                    </td>
                                    <td className="p-3 text-right font-medium text-gray-900 dark:text-gray-100 tabular-nums sm:p-4">
                                        {formatMoney(row.subtotal, { showDecimals: true })}
                                    </td>
                                </tr>
                            ))}

                            <tr className="border-t border-gray-200 dark:border-gray-800">
                                <td
                                    colSpan={3}
                                    className="p-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300 sm:p-4"
                                >
                                    Total
                                </td>
                                <td className="p-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums sm:p-4">
                                    {formatMoney(data.total_amount, { showDecimals: true })}
                                </td>
                            </tr>
                        </TBody>
                    </Table>
                </TableCard>
            </div>
        </AppLayout>
    );
}

