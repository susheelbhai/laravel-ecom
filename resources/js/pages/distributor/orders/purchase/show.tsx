import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/distributor/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import { type BreadcrumbItem, type SharedData } from '@/types';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import { useFormatMoney } from '@/hooks/use-format-money';

type AddItemForm = { product_id: string; quantity: string };

const statusUi: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
    approved: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
    rejected: { label: 'Rejected', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
};

const thead = [
    { title: 'Product', className: 'p-3' },
    { title: 'Qty', className: 'p-3 text-right' },
    { title: 'Unit price', className: 'p-3 text-right' },
    { title: 'Subtotal', className: 'p-3 text-right' },
];

export default function DistributorPurchaseOrderShow() {
    const { data } = usePage<SharedData>().props as any;
    const { formatMoney } = useFormatMoney();
    const isPending = data?.status === 'pending';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Purchase Orders', href: route('distributor.purchase-orders.index') },
        { title: data?.order_number ?? 'Order', href: '#' },
    ];

    const { submit, inputDivData, processing } = useFormHandler<AddItemForm>({
        url: route('distributor.purchase-orders.items.add', data?.id),
        initialValues: { product_id: '', quantity: '1' },
        method: 'POST',
    });

    const statusMeta = statusUi[data?.status] ?? { label: data?.status ?? '—', className: 'bg-gray-50 text-gray-700 ring-gray-200' };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data?.order_number ?? 'Purchase order'} />

            <div className="w-full space-y-6 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-semibold">{data?.order_number}</h1>
                    <span className={['inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', statusMeta.className].join(' ')}>
                        {statusMeta.label}
                    </span>
                    <span className="text-sm text-gray-500">· Placed {data.created_at}</span>
                </div>

                {isPending && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Awaiting admin review. You can still add more items below.
                    </div>
                )}

                {data?.status === 'rejected' && data.rejection_note && (
                    <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        <span className="font-medium">Rejection reason:</span> {data.rejection_note}
                    </div>
                )}

                <TableCard>
                    <Table>
                        <THead data={thead} />
                        <TBody>
                            {data.items.map((row: any) => (
                                <tr key={row.id} className="border-t border-gray-200">
                                    <td className="p-3 font-medium">{row.product_title}</td>
                                    <td className="p-3 text-right tabular-nums">{row.quantity}</td>
                                    <td className="p-3 text-right tabular-nums">{formatMoney(row.unit_price)}</td>
                                    <td className="p-3 text-right font-medium tabular-nums">{formatMoney(row.subtotal)}</td>
                                </tr>
                            ))}
                            <tr className="border-t border-gray-200">
                                <td colSpan={3} className="p-3 text-right text-sm font-medium text-gray-600">Total</td>
                                <td className="p-3 text-right text-sm font-semibold tabular-nums">{formatMoney(data.total_amount)}</td>
                            </tr>
                        </TBody>
                    </Table>
                </TableCard>

                {isPending && (
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="mb-3 text-sm font-medium">Add another item</div>
                        <FormContainer onSubmit={submit} processing={processing} buttonLabel="Add item">
                            <InputDiv
                                type="async-select"
                                label="Product"
                                name="product_id"
                                inputDivData={inputDivData}
                                required
                                fetchRouteName="distributor.products.search"
                                fetchQueryParam="q"
                                minSearchLength={2}
                                placeholder="Type at least 2 characters to search…"
                            />
                            <InputDiv
                                type="number"
                                label="Quantity"
                                name="quantity"
                                inputDivData={inputDivData}
                                min={1}
                                required
                            />
                        </FormContainer>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
