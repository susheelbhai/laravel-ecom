import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useRef } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import HeadingSmall from '@/components/ui/typography/heading-small';
import Button from '@/components/ui/button/button';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { useFormatMoney } from '@/hooks/use-format-money';
import PaymentInitialSection from '@/components/payment/PaymentInitialSection';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Distributor Orders', href: '/admin/distributor-orders' },
    { title: 'Create', href: '/admin/distributor-orders/create' },
];

type ItemRow = {
    product_id: string;
    quantity: number;
    unit_price: string;
    base_distributor_price: number | null;
    serial_numbers: string[];
    // Available serials fetched from the server for this product+rack
    available_serials: string[];
};

type FormData = {
    distributor_id: string;
    source_rack_id: string;
    items: ItemRow[];
    payment_status: string;
    amount_paid: string;
    payment_method: string;
    note: string;
    payment_proof: File | null;
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
    serial_numbers: [],
    available_serials: [],
});

export default function AdminDistributorOrderCreate() {
    const { distributors, sourceWarehouses, sourceRacks } =
        usePage<SharedData>().props as any as Props;
    const { formatMoney } = useFormatMoney();

    const { data, setData, post, processing, errors } = useForm<FormData>({
        distributor_id: '',
        source_rack_id: '',
        items: [emptyRow()],
        payment_status: 'unpaid',
        amount_paid: '',
        payment_method: '',
        note: '',
        payment_proof: null,
    });

    // Inertia can rehydrate arrays as objects after a validation error — always normalise.
    const itemsArray: ItemRow[] = Array.isArray(data.items)
        ? data.items
        : Object.values(data.items as Record<string, ItemRow>);

    // Keep a ref so async callbacks (fetchSerials) always see the latest items
    // without needing a functional updater (which useForm doesn't support).
    const itemsRef = useRef<ItemRow[]>(itemsArray);
    itemsRef.current = itemsArray;

    const subtotal = useMemo(() => {
        return itemsArray.reduce((sum, row) => {
            const base = row.base_distributor_price;
            if (base == null) return sum;
            const unitPrice = row.unit_price !== '' ? Number(row.unit_price) : base;
            return sum + unitPrice * Number(row.quantity || 0);
        }, 0);
    }, [itemsArray]);

    // inputDivData for top-level fields
    const inputDivData = {
        data: data as Record<string, any>,
        setData: (name: string, value: any) => {
            if (name === 'source_rack_id') {
                // When rack changes, clear all serial selections and re-fetch
                const next = itemsArray.map((row) => ({
                    ...row,
                    serial_numbers: [],
                    available_serials: [],
                }));
                setData('items', next);
                // Fetch serials for each row that already has a product selected
                next.forEach((row, idx) => {
                    if (row.product_id && value) {
                        fetchSerials(idx, row.product_id, value);
                    }
                });
            }
            setData(name as keyof FormData, value);
        },
        errors: Object.fromEntries(
            Object.entries(errors).map(([k, v]) => [k, v ? [v as string] : []])
        ) as Record<string, string[]>,
    };

    async function fetchSerials(idx: number, productId: string, rackId: string) {
        if (!productId || !rackId) return;
        try {
            const { data: result } = await axios.get(
                route('admin.distributor-orders.products.serials', productId),
                {
                    params: { rack_id: rackId },
                    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                },
            );
            // Use the ref so we always have the latest items, not a stale closure.
            const current = [...itemsRef.current];
            current[idx] = {
                ...current[idx],
                available_serials: result.serial_numbers ?? [],
                serial_numbers: [],
            };
            setData('items', current);
        } catch {
            // ignore
        }
    }

    // Per-row inputDivData
    const rowInputDivData = (idx: number) => ({
        data: itemsArray[idx] as Record<string, any>,
        setData: async (name: string, value: any) => {
            const next = [...itemsArray];
            next[idx] = { ...next[idx], [name]: value };

            if (name === 'product_id' && value) {
                try {
                    const [pricingRes] = await Promise.all([
                        axios.get(
                            route('admin.distributor-orders.products.pricing', value),
                            { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
                        ),
                    ]);
                    const basePrice = pricingRes.data?.distributor_price != null
                        ? Number(pricingRes.data.distributor_price)
                        : null;
                    next[idx] = {
                        ...next[idx],
                        base_distributor_price: basePrice,
                        unit_price: next[idx].unit_price === '' ? String(basePrice ?? '') : next[idx].unit_price,
                        serial_numbers: [],
                        available_serials: [],
                    };
                    setData('items', next);

                    // Fetch serials after state update
                    if (data.source_rack_id) {
                        fetchSerials(idx, value, data.source_rack_id);
                    }
                } catch {
                    next[idx] = { ...next[idx], base_distributor_price: null };
                    setData('items', next);
                }
            } else if (name === 'product_id' && !value) {
                next[idx] = {
                    ...next[idx],
                    base_distributor_price: null,
                    unit_price: '',
                    serial_numbers: [],
                    available_serials: [],
                };
                setData('items', next);
            } else {
                setData('items', next);
            }
        },
        errors: {
            product_id: errors[`items.${idx}.product_id` as keyof typeof errors]
                ? [errors[`items.${idx}.product_id` as keyof typeof errors] as string] : [],
            quantity: errors[`items.${idx}.quantity` as keyof typeof errors]
                ? [errors[`items.${idx}.quantity` as keyof typeof errors] as string] : [],
            unit_price: errors[`items.${idx}.unit_price` as keyof typeof errors]
                ? [errors[`items.${idx}.unit_price` as keyof typeof errors] as string] : [],
        } as Record<string, string[]>,
    });

    function toggleSerial(idx: number, sn: string) {
        const current = itemsArray[idx].serial_numbers;
        const next = current.includes(sn)
            ? current.filter((s) => s !== sn)
            : [...current, sn];
        const rows = [...itemsArray];
        rows[idx] = { ...rows[idx], serial_numbers: next, quantity: next.length || rows[idx].quantity };
        setData('items', rows);
    }

    function selectAllSerials(idx: number) {
        const all = itemsArray[idx].available_serials;
        const rows = [...itemsArray];
        rows[idx] = { ...rows[idx], serial_numbers: all, quantity: all.length };
        setData('items', rows);
    }

    function clearSerials(idx: number) {
        const rows = [...itemsArray];
        rows[idx] = { ...rows[idx], serial_numbers: [] };
        setData('items', rows);
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.distributor-orders.store'), { forceFormData: true });
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
                        {itemsArray.map((row, idx) => (
                            <div key={idx} className="rounded-div border border-gray-200 p-3 space-y-3">
                                {/* Product / Qty / Price row */}
                                <div className="grid grid-cols-12 items-start gap-3">
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
                                            disabled={row.available_serials.length > 0}
                                        />
                                        {row.available_serials.length > 0 && (
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Set by serial selection
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-span-3">
                                        <InputDiv
                                            type="number"
                                            label="Unit price"
                                            name="unit_price"
                                            inputDivData={rowInputDivData(idx)}
                                            min={0}
                                            step="0.01"
                                            placeholder={row.base_distributor_price != null
                                                ? `Default: ${formatMoney(row.base_distributor_price)}`
                                                : 'Override'}
                                        />
                                    </div>
                                    <div className="col-span-1 flex items-end pb-1">
                                        <Button type="button" variant="ghost" onClick={() => {
                                            const next = itemsArray.filter((_, i) => i !== idx);
                                            setData('items', next.length ? next : [emptyRow()]);
                                        }}>✕</Button>
                                    </div>
                                </div>

                                {/* Serial number selector — shown when product has serialised stock in the rack */}
                                {row.available_serials.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">
                                                Select serial numbers to transfer
                                                <span className="ml-1 text-red-500">*</span>
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {row.serial_numbers.length} of {row.available_serials.length} selected
                                            </span>
                                        </div>

                                        <div className="max-h-48 overflow-y-auto rounded-div border border-gray-200 bg-gray-50 p-2">
                                            {row.available_serials.map((sn) => (
                                                <label
                                                    key={sn}
                                                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={row.serial_numbers.includes(sn)}
                                                        onChange={() => toggleSerial(idx, sn)}
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                                    />
                                                    <span className="font-mono text-sm">{sn}</span>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="flex gap-3 text-xs">
                                            <button type="button" onClick={() => selectAllSerials(idx)}
                                                className="text-blue-600 hover:underline">
                                                Select all
                                            </button>
                                            <button type="button" onClick={() => clearSerials(idx)}
                                                className="text-gray-500 hover:underline">
                                                Clear
                                            </button>
                                        </div>

                                        {errors[`items.${idx}.serial_numbers` as keyof typeof errors] && (
                                            <p className="text-sm text-red-600">
                                                {errors[`items.${idx}.serial_numbers` as keyof typeof errors]}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        <Button type="button" variant="secondary"
                            onClick={() => setData('items', [...itemsArray, emptyRow()])}>
                            Add item
                        </Button>
                    </div>

                    <div className="text-sm text-gray-700">
                        Subtotal: <span className="font-medium">{formatMoney(subtotal)}</span>
                    </div>

                    <PaymentInitialSection
                        data={data as Record<string, any>}
                        setData={(key, value) => setData(key as keyof FormData, value)}
                        errors={Object.fromEntries(
                            Object.entries(errors).map(([k, v]) => [k, v as string])
                        )}
                        totalAmount={subtotal}
                    />
                </FormContainer>
            </div>
        </AppLayout>
    );
}
