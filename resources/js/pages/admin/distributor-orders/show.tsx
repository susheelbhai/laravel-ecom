import { Head, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import { useFormatMoney } from '@/hooks/use-format-money';

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
        { title: 'Unit price', className: 'p-3 text-right' },
        { title: 'Subtotal', className: 'p-3 text-right' },
        { title: 'Price source', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data?.order_number ?? 'Distributor order'} />

            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <div className="text-sm text-gray-600">
                        Distributor: <span className="font-medium">{data.distributor?.name}</span>
                        {data.distributor?.email ? ` (${data.distributor.email})` : ''}
                    </div>
                    {data.source_warehouse?.name && (
                        <div className="text-sm text-gray-600">
                            Source warehouse:{' '}
                            <span className="font-medium">{data.source_warehouse.name}</span>
                            {data.source_rack?.identifier
                                ? ` — Rack: ${data.source_rack.identifier}`
                                : ''}
                        </div>
                    )}
                    <div className="text-sm text-gray-600">
                        Status:{' '}
                        <span className="capitalize font-medium">{data.status}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        Total:{' '}
                        <span className="font-medium">{formatMoney(data.total_amount)}</span>
                    </div>
                    <div className="text-sm text-gray-600">Created: {data.created_at}</div>
                    {data.approved_at && (
                        <div className="text-sm text-gray-600">
                            Approved: {data.approved_at}
                        </div>
                    )}
                    {data.rejected_at && (
                        <div className="text-sm text-gray-600">
                            Rejected: {data.rejected_at}
                        </div>
                    )}
                    {data.rejection_note && (
                        <div className="text-sm text-rose-600">
                            Rejection reason: {data.rejection_note}
                        </div>
                    )}
                </div>

                {isPending && (
                    <div className="flex shrink-0 gap-2">
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
                    </div>
                )}
            </div>

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {data.items.map((row: any) => (
                            <tr key={row.id} className="border-t border-gray-200">
                                <td className="p-3">{row.product_title}</td>
                                <td className="p-3 text-right">{row.quantity}</td>
                                <td className="p-3 text-right">
                                    {formatMoney(row.unit_price)}
                                </td>
                                <td className="p-3 text-right">
                                    {formatMoney(row.subtotal)}
                                </td>
                                <td className="p-3 capitalize text-sm text-gray-500">
                                    {row.price_source?.replace(/_/g, ' ')}
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
            </TableCard>
        </AppLayout>
    );
}
