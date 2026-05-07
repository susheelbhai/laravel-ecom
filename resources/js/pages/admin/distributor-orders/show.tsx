import { Head, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import { useFormatMoney } from '@/hooks/use-format-money';
import OrderSummaryCard from '@/components/order/OrderSummaryCard';
import OrderDetailItem from '@/components/order/OrderDetailItem';
import PaymentSummarySection from '@/components/payment/PaymentSummarySection';

export default function AdminDistributorOrderShow() {
    const { data } = usePage<SharedData>().props as any;
    const { formatMoney } = useFormatMoney();
    const isPending = data?.status === 'pending';

    const rejectForm = useForm<{ rejection_note: string }>({ rejection_note: '' });

    const handleReject = async () => {
        const result = await Swal.fire({
            title: 'Reject order?',
            input: 'textarea',
            inputLabel: 'Rejection reason (optional)',
            inputPlaceholder: 'Enter a reason for the distributor…',
            inputAttributes: { maxlength: '2000' },
            showCancelButton: true,
            confirmButtonText: 'Reject order',
            confirmButtonColor: '#dc2626',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        rejectForm.setData('rejection_note', result.value ?? '');
        rejectForm.patch(route('admin.distributor-orders.reject', data.id), {
            data: { rejection_note: result.value ?? '' },
        } as any);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Distributor Orders', href: '/admin/distributor-orders' },
        { title: data?.order_number ?? 'Order', href: '#' },
    ];

    const thead = [
        { title: 'Product', className: 'p-3' },
        { title: 'Qty', className: 'p-3 text-right' },
        { title: 'Unit Price', className: 'p-3 text-right' },
        { title: 'Subtotal', className: 'p-3 text-right' },
        { title: 'Price Source', className: 'p-3' },
        { title: 'Serial Numbers', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data?.order_number ?? 'Distributor order'} />

            <OrderSummaryCard
                orderNumber={data.order_number}
                status={data.status}
                rejectionNote={data.rejection_note}
                actions={
                    isPending ? (
                        <>
                            <a
                                href={route('admin.distributor-orders.approve.form', data.id)}
                                className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none"
                            >
                                Approve
                            </a>
                            <button
                                type="button"
                                disabled={rejectForm.processing}
                                onClick={handleReject}
                                className="inline-flex items-center rounded-md border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 shadow-sm hover:bg-rose-50 focus:outline-none disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </>
                    ) : undefined
                }
            >
                <OrderDetailItem label="Distributor">
                    {data.distributor?.name ?? '—'}
                    {data.distributor?.email && (
                        <span className="block text-xs font-normal text-muted-foreground">
                            {data.distributor.email}
                        </span>
                    )}
                </OrderDetailItem>

                {data.source_warehouse?.name && (
                    <OrderDetailItem label="Source Warehouse">
                        {data.source_warehouse.name}
                        {data.source_rack?.identifier && (
                            <span className="block text-xs font-normal text-muted-foreground">
                                Rack: {data.source_rack.identifier}
                            </span>
                        )}
                    </OrderDetailItem>
                )}

                <OrderDetailItem label="Total">{formatMoney(data.total_amount)}</OrderDetailItem>
                <OrderDetailItem label="Created">{data.created_at}</OrderDetailItem>

                {data.approved_at && (
                    <OrderDetailItem label="Approved">{data.approved_at}</OrderDetailItem>
                )}
                {data.rejected_at && (
                    <OrderDetailItem label="Rejected">{data.rejected_at}</OrderDetailItem>
                )}
            </OrderSummaryCard>

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {data.items.map((row: any) => (
                            <tr key={row.id} className="border-t border-gray-200 transition-colors hover:bg-muted/40">
                                <td className="p-3 font-medium text-foreground">{row.product_title}</td>
                                <td className="p-3 text-right tabular-nums">{row.quantity}</td>
                                <td className="p-3 text-right tabular-nums">{formatMoney(row.unit_price)}</td>
                                <td className="p-3 text-right font-medium tabular-nums">{formatMoney(row.subtotal)}</td>
                                <td className="p-3">
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                                        {row.price_source?.replace(/_/g, ' ') ?? '—'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {row.serial_numbers?.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {row.serial_numbers.map((sn: string) => (
                                                <span
                                                    key={sn}
                                                    className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700"
                                                >
                                                    {sn}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
            </TableCard>

            {data.payment_summary && (
                <PaymentSummarySection
                    summary={data.payment_summary}
                    storeRoute="admin.distributor-orders.payments.store"
                    storeRouteParams={{ distributor_order: data.id }}
                    canAddPayment={true}
                />
            )}
        </AppLayout>
    );
}
