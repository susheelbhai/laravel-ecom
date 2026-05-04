import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import HeadingSmall from '@/components/ui/typography/heading-small';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { useFormatMoney } from '@/hooks/use-format-money';

type OrderItem = {
    id: number;
    product_id: number;
    product_title: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
};

type OrderData = {
    id: number;
    order_number: string;
    distributor: { id: number; name: string };
    items: OrderItem[];
    subtotal_amount: number;
    total_amount: number;
};

type Props = {
    data: OrderData;
    sourceWarehouses: { id: number; name: string }[];
    sourceRacks: { id: number; warehouse_id: number; identifier: string }[];
};

type FormItem = {
    id: number;
    quantity: number;
    unit_price: string;
};

type FormData = {
    source_rack_id: string;
    items: FormItem[];
};

export default function AdminDistributorOrderApprove() {
    const {
        data: order,
        sourceWarehouses,
        sourceRacks,
    } = usePage<SharedData>().props as any as Props;
    const { formatMoney } = useFormatMoney();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Distributor Orders', href: '/admin/distributor-orders' },
        {
            title: order.order_number,
            href: route('admin.distributor-orders.show', order.id),
        },
        { title: 'Approve', href: '#' },
    ];

    const { data, setData, patch, processing, errors } = useForm<FormData>({
        source_rack_id: '',
        items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unit_price: String(item.unit_price),
        })),
    });

    // inputDivData for top-level source_rack_id field
    const inputDivData = {
        data: data as Record<string, any>,
        setData: (name: string, value: any) => setData(name as keyof FormData, value),
        errors: Object.fromEntries(
            Object.entries(errors).map(([k, v]) => [k, v ? [v as string] : []])
        ) as Record<string, string[]>,
    };

    // Per-row inputDivData — flat view of one item's fields
    const rowInputDivData = (idx: number) => ({
        data: data.items[idx] as Record<string, any>,
        setData: (name: string, value: any) => {
            const next = [...data.items];
            next[idx] = { ...next[idx], [name]: value };
            setData('items', next);
        },
        errors: {
            quantity: errors[`items.${idx}.quantity` as keyof typeof errors] ? [errors[`items.${idx}.quantity` as keyof typeof errors] as string] : [],
            unit_price: errors[`items.${idx}.unit_price` as keyof typeof errors] ? [errors[`items.${idx}.unit_price` as keyof typeof errors] as string] : [],
        } as Record<string, string[]>,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.distributor-orders.approve', order.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Approve — ${order.order_number}`} />

            <div className="mx-auto max-w-3xl space-y-6 p-4">
                <HeadingSmall
                    title={`Approve order ${order.order_number}`}
                    description={`Distributor: ${order.distributor.name}. Choose the source rack and optionally adjust quantities and prices before approving.`}
                />

                <FormContainer
                    onSubmit={submit}
                    processing={processing}
                    buttonLabel="Approve & transfer stock"
                    className="space-y-6"
                >
                    {/* Top-level items error (e.g. stock shortage) */}
                    {(errors as any).items && (
                        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                            {(errors as any).items}
                        </div>
                    )}

                    {/* Source rack — grouped by warehouse using children optgroups */}
                    <InputDiv
                        type="select"
                        label="Source rack (Admin warehouse)"
                        name="source_rack_id"
                        inputDivData={inputDivData}
                        required
                    >
                        {sourceWarehouses.map((w) => (
                            <optgroup key={w.id} label={w.name}>
                                {sourceRacks
                                    .filter((r) => r.warehouse_id === w.id)
                                    .map((r) => (
                                        <option key={r.id} value={String(r.id)}>
                                            {r.identifier}
                                        </option>
                                    ))}
                            </optgroup>
                        ))}
                    </InputDiv>

                    {/* Items table */}
                    <div className="space-y-3">
                        <div className="text-sm font-medium">Order items</div>
                        <div className="grid grid-cols-12 gap-2 px-1 text-xs font-medium text-gray-500">
                            <div className="col-span-4">Product</div>
                            <div className="col-span-4">Qty</div>
                            <div className="col-span-4">Unit price</div>
                        </div>
                        {data.items.map((row, idx) => (
                            <div key={row.id} className="grid grid-cols-12 items-start gap-2">
                                <div className="col-span-4 pt-2 text-sm text-gray-800 dark:text-gray-200">
                                    {order.items[idx]?.product_title}
                                </div>
                                <div className="col-span-4">
                                    <InputDiv
                                        type="number"
                                        label=""
                                        name="quantity"
                                        inputDivData={rowInputDivData(idx)}
                                        min={1}
                                    />
                                </div>
                                <div className="col-span-4">
                                    <InputDiv
                                        type="number"
                                        label=""
                                        name="unit_price"
                                        inputDivData={rowInputDivData(idx)}
                                        min={0}
                                        step="0.01"
                                        placeholder="Override price"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Original total:{' '}
                        <span className="font-medium">
                            {formatMoney(order.total_amount)}
                        </span>
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}
