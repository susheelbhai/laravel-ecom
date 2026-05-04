import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useMemo } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import HeadingSmall from '@/components/ui/typography/heading-small';
import Button from '@/components/ui/button/button';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { useFormatMoney } from '@/hooks/use-format-money';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Distributor Orders', href: '/admin/distributor-orders' },
    { title: 'Create', href: '/admin/distributor-orders/create' },
];

type ItemRow = {
    product_id: string;
    quantity: number;
    unit_price: string;
    base_distributor_price: number | null;
};

type FormData = {
    distributor_id: string;
    source_rack_id: string;
    items: ItemRow[];
};

type Props = {
    distributors: { id: number; name: string; email: string }[];
    sourceWarehouses: { id: number; name: string }[];
    sourceRacks: { id: number; warehouse_id: number; identifier: string }[];
};

const emptyRow = (): ItemRow => ({
    product_id: '',
    quantity: 1,
    unit_price: '',
    base_distributor_price: null,
});

export default function AdminDistributorOrderCreate() {
    const { distributors, sourceWarehouses, sourceRacks } =
        usePage<SharedData>().props as any as Props;
    const { formatMoney } = useFormatMoney();

    const { data, setData, post, processing, errors } = useForm<FormData>({
        distributor_id: '',
        source_rack_id: '',
        items: [emptyRow()],
    });

    const subtotal = useMemo(() => {
        return data.items.reduce((sum, row) => {
            const base = row.base_distributor_price;
            if (base == null) return sum;
            const unitPrice = row.unit_price !== '' ? Number(row.unit_price) : base;
            return sum + unitPrice * Number(row.quantity || 0);
        }, 0);
    }, [data.items]);

    // inputDivData for top-level fields — same shape useFormHandler returns
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
        setData: async (name: string, value: any) => {
            const next = [...data.items];
            next[idx] = { ...next[idx], [name]: value };

            if (name === 'product_id' && value) {
                try {
                    const { data: pricing } = await axios.get(
                        route('admin.distributor-orders.products.pricing', value),
                        { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
                    );
                    const basePrice = pricing?.distributor_price != null ? Number(pricing.distributor_price) : null;
                    next[idx] = {
                        ...next[idx],
                        base_distributor_price: basePrice,
                        unit_price: next[idx].unit_price === '' ? String(basePrice ?? '') : next[idx].unit_price,
                    };
                } catch {
                    next[idx] = { ...next[idx], base_distributor_price: null };
                }
            } else if (name === 'product_id' && !value) {
                next[idx] = { ...next[idx], base_distributor_price: null, unit_price: '' };
            }

            setData('items', next);
        },
        errors: {
            product_id: errors[`items.${idx}.product_id` as keyof typeof errors] ? [errors[`items.${idx}.product_id` as keyof typeof errors] as string] : [],
            quantity: errors[`items.${idx}.quantity` as keyof typeof errors] ? [errors[`items.${idx}.quantity` as keyof typeof errors] as string] : [],
            unit_price: errors[`items.${idx}.unit_price` as keyof typeof errors] ? [errors[`items.${idx}.unit_price` as keyof typeof errors] as string] : [],
        } as Record<string, string[]>,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.distributor-orders.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Place distributor order" />

            <div className="mx-auto max-w-3xl space-y-6 p-4">
                <HeadingSmall
                    title="Place distributor order"
                    description="Select a distributor, choose an admin source rack, add items, and optionally override prices."
                />

                <FormContainer onSubmit={submit} processing={processing} buttonLabel="Place order" className="space-y-4">
                    <InputDiv
                        type="select"
                        label="Distributor"
                        name="distributor_id"
                        inputDivData={inputDivData}
                        options={distributors.map((d) => ({ id: d.id, title: `${d.name} (${d.email})` }))}
                        required
                    />

                    <InputDiv
                        type="select"
                        label="Source rack (Admin)"
                        name="source_rack_id"
                        inputDivData={inputDivData}
                        required
                    >
                        {sourceWarehouses.map((w) => (
                            <optgroup key={w.id} label={w.name}>
                                {sourceRacks.filter((r) => r.warehouse_id === w.id).map((r) => (
                                    <option key={r.id} value={String(r.id)}>{r.identifier}</option>
                                ))}
                            </optgroup>
                        ))}
                    </InputDiv>

                    <div className="space-y-3">
                        <div className="text-sm font-medium">Items</div>
                        {data.items.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-12 items-start gap-3">
                                <div className="col-span-6">
                                    <InputDiv
                                        type="async-select"
                                        label="Product"
                                        name="product_id"
                                        inputDivData={rowInputDivData(idx)}
                                        fetchRouteName="admin.stock.products.search"
                                        fetchQueryParam="q"
                                        minSearchLength={2}
                                        placeholder="Type at least 2 characters to search…"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <InputDiv
                                        type="number"
                                        label="Qty"
                                        name="quantity"
                                        inputDivData={rowInputDivData(idx)}
                                        min={1}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <InputDiv
                                        type="number"
                                        label="Unit price"
                                        name="unit_price"
                                        inputDivData={rowInputDivData(idx)}
                                        min={0}
                                        step="0.01"
                                        placeholder={row.base_distributor_price != null ? `Default: ${formatMoney(row.base_distributor_price)}` : 'Override'}
                                    />
                                </div>
                                <div className="col-span-1 flex items-end pb-1">
                                    <Button type="button" variant="ghost" onClick={() => {
                                        const next = data.items.filter((_, i) => i !== idx);
                                        setData('items', next.length ? next : [emptyRow()]);
                                    }}>✕</Button>
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={() => setData('items', [...data.items, emptyRow()])}>
                            Add item
                        </Button>
                    </div>

                    <div className="text-sm text-gray-700">
                        Subtotal: <span className="font-medium">{formatMoney(subtotal)}</span>
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}
