import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
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
    serial_numbers: string[];
};

type FormData = {
    source_rack_id: string;
    items: FormItem[];
};

export default function AdminDistributorOrderApprove() {
    const { data: order, sourceWarehouses, sourceRacks } = usePage<SharedData>().props as any as Props;
    const { formatMoney } = useFormatMoney();

    // Available serials per item index, keyed by idx
    const [availableSerials, setAvailableSerials] = useState<Record<number, string[]>>({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Distributor Orders', href: '/admin/distributor-orders' },
        { title: order.order_number, href: route('admin.distributor-orders.show', order.id) },
        { title: 'Approve', href: '#' },
    ];

    const { data, setData, patch, processing, errors } = useForm<FormData>({
        source_rack_id: '',
        items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unit_price: String(item.unit_price),
            serial_numbers: [],
        })),
    });

    const dataRef = useRef(data);
    dataRef.current = data;

    async function fetchSerialsForRack(rackId: string) {
        if (!rackId) { setAvailableSerials({}); return; }
        const results: Record<number, string[]> = {};
        await Promise.all(
            order.items.map(async (item, idx) => {
                try {
                    const { data: result } = await axios.get(
                        route('admin.distributor-orders.products.serials', item.product_id),
                        { params: { rack_id: rackId }, headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
                    );
                    results[idx] = result.serial_numbers ?? [];
                } catch {
                    results[idx] = [];
                }
            })
        );
        setAvailableSerials(results);
        // Reset serial selections
        setData('items', dataRef.current.items.map(item => ({ ...item, serial_numbers: [] })));
    }

    function toggleSerial(idx: number, sn: string) {
        const current = dataRef.current.items[idx].serial_numbers;
        const next = current.includes(sn) ? current.filter(s => s !== sn) : [...current, sn];
        const items = [...dataRef.current.items];
        items[idx] = { ...items[idx], serial_numbers: next, quantity: next.length || items[idx].quantity };
        setData('items', items);
    }

    const inputDivData = {
        data: data as Record<string, any>,
        setData: (name: string, value: any) => {
            if (name === 'source_rack_id') fetchSerialsForRack(value);
            setData(name as keyof FormData, value);
        },
        errors: Object.fromEntries(
            Object.entries(errors).map(([k, v]) => [k, v ? [v as string] : []])
        ) as Record<string, string[]>,
    };

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

                <FormContainer onSubmit={submit} processing={processing} buttonLabel="Approve & transfer stock" className="space-y-6">
                    {(errors as any).items && (
                        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                            {(errors as any).items}
                        </div>
                    )}

                    <InputDiv type="select" label="Source rack (Admin warehouse)" name="source_rack_id" inputDivData={inputDivData} required>
                        {sourceWarehouses.map((w) => (
                            <optgroup key={w.id} label={w.name}>
                                {sourceRacks.filter((r) => r.warehouse_id === w.id).map((r) => (
                                    <option key={r.id} value={String(r.id)}>{r.identifier}</option>
                                ))}
                            </optgroup>
                        ))}
                    </InputDiv>

                    <div className="space-y-4">
                        <div className="text-sm font-medium">Order items</div>
                        {data.items.map((row, idx) => {
                            const serials = availableSerials[idx] ?? [];
                            const isSerialized = serials.length > 0;
                            return (
                                <div key={row.id} className="rounded-lg border border-gray-200 p-3 space-y-3">
                                    <div className="font-medium text-sm">{order.items[idx]?.product_title}</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {!isSerialized && (
                                            <InputDiv type="number" label="Qty" name="quantity" inputDivData={rowInputDivData(idx)} min={1} />
                                        )}
                                        <InputDiv type="number" label="Unit price" name="unit_price" inputDivData={rowInputDivData(idx)} min={0} step="0.01" placeholder="Override price" />
                                    </div>

                                    {isSerialized && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                                    Select serial numbers
                                                    <span className="ml-1 text-red-500">*</span>
                                                </span>
                                                <span className="text-xs text-gray-500">{row.serial_numbers.length} of {serials.length} selected</span>
                                            </div>
                                            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
                                                {serials.map((sn) => (
                                                    <label key={sn} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-100">
                                                        <input type="checkbox" checked={row.serial_numbers.includes(sn)} onChange={() => toggleSerial(idx, sn)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                                                        <span className="font-mono text-sm">{sn}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="flex gap-3 text-xs">
                                                <button type="button" onClick={() => { const items = [...dataRef.current.items]; items[idx] = { ...items[idx], serial_numbers: serials, quantity: serials.length }; setData('items', items); }} className="text-blue-600 hover:underline">Select all</button>
                                                <button type="button" onClick={() => { const items = [...dataRef.current.items]; items[idx] = { ...items[idx], serial_numbers: [] }; setData('items', items); }} className="text-gray-500 hover:underline">Clear</button>
                                            </div>
                                            <p className="text-sm text-gray-600">Qty: <span className="font-medium">{row.serial_numbers.length}</span></p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Original total: <span className="font-medium">{formatMoney(order.total_amount)}</span>
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}
