import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { useMemo } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import HeadingSmall from '@/components/ui/typography/heading-small';
import InputError from '@/components/form/input/input-error';
import Button from '@/components/ui/button/button';
import { Input } from '@/components/form/input/input';
import { Label } from '@/components/form/input/label';
import AppLayout from '@/layouts/dealer/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { useFormatMoney } from '@/hooks/use-format-money';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Retail Sales', href: '/dealer/retail-sales' },
    { title: 'Create', href: '/dealer/retail-sales/create' },
];

type ItemRow = { product_id: string; quantity: number; unit_price?: number | '' };

type Props = {
    products: { id: number; title: string; sku?: string; price: number }[];
};

export default function DealerRetailSaleCreate() {
    const { products } = usePage<SharedData>().props as any as Props;
    const { formatMoney } = useFormatMoney();

    const { data, setData, post, processing, errors } = useForm<{
        items: ItemRow[];
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        billing_address_line1: string;
        billing_address_line2: string;
        billing_city: string;
        billing_state: string;
        billing_pincode: string;
        billing_country: string;
        customer_gstin: string;
    }>({
        items: [{ product_id: '', quantity: 1, unit_price: '' }],
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        billing_address_line1: '',
        billing_address_line2: '',
        billing_city: '',
        billing_state: '',
        billing_pincode: '',
        billing_country: 'India',
        customer_gstin: '',
    });

    const productMap = useMemo(() => {
        const m = new Map<number, any>();
        products.forEach((p) => m.set(p.id, p));
        return m;
    }, [products]);

    const subtotal = useMemo(() => {
        return data.items.reduce((sum, row) => {
            const pid = Number(row.product_id);
            const product = productMap.get(pid);
            if (!product) return sum;
            const unitPrice =
                row.unit_price !== '' && row.unit_price != null
                    ? Number(row.unit_price)
                    : Number(product.price);
            return sum + unitPrice * Number(row.quantity || 0);
        }, 0);
    }, [data.items, productMap]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dealer.retail-sales.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record retail sale" />

            <div className="mx-auto max-w-3xl space-y-6 p-4">
                <HeadingSmall
                    title="Record retail sale"
                    description="Record a consumer sale and reduce your dealer stock."
                />

                <FormContainer
                    onSubmit={submit}
                    processing={processing}
                    buttonLabel="Record sale"
                    className="space-y-4"
                >
                    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
                        <div className="text-sm font-medium">Customer & billing</div>
                        <p className="text-xs text-gray-600">
                            Used for tax invoices and warranty registration. Enter the buyer&apos;s
                            details as they should appear on documents.
                        </p>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <Label>Customer name</Label>
                                <Input
                                    className="mt-1"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    autoComplete="name"
                                />
                                <InputError message={errors.customer_name} />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input
                                    className="mt-1"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    autoComplete="tel"
                                />
                                <InputError message={errors.customer_phone} />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Email (optional)</Label>
                                <Input
                                    className="mt-1"
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    autoComplete="email"
                                />
                                <InputError message={errors.customer_email} />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Address line 1</Label>
                                <Input
                                    className="mt-1"
                                    value={data.billing_address_line1}
                                    onChange={(e) =>
                                        setData('billing_address_line1', e.target.value)
                                    }
                                />
                                <InputError message={errors.billing_address_line1} />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Address line 2 (optional)</Label>
                                <Input
                                    className="mt-1"
                                    value={data.billing_address_line2}
                                    onChange={(e) =>
                                        setData('billing_address_line2', e.target.value)
                                    }
                                />
                                <InputError message={errors.billing_address_line2} />
                            </div>
                            <div>
                                <Label>City</Label>
                                <Input
                                    className="mt-1"
                                    value={data.billing_city}
                                    onChange={(e) => setData('billing_city', e.target.value)}
                                />
                                <InputError message={errors.billing_city} />
                            </div>
                            <div>
                                <Label>State / province</Label>
                                <Input
                                    className="mt-1"
                                    value={data.billing_state}
                                    onChange={(e) => setData('billing_state', e.target.value)}
                                />
                                <InputError message={errors.billing_state} />
                            </div>
                            <div>
                                <Label>PIN / postal code</Label>
                                <Input
                                    className="mt-1"
                                    value={data.billing_pincode}
                                    onChange={(e) => setData('billing_pincode', e.target.value)}
                                />
                                <InputError message={errors.billing_pincode} />
                            </div>
                            <div>
                                <Label>Country</Label>
                                <Input
                                    className="mt-1"
                                    value={data.billing_country}
                                    onChange={(e) => setData('billing_country', e.target.value)}
                                />
                                <InputError message={errors.billing_country} />
                            </div>
                            <div className="md:col-span-2">
                                <Label>GSTIN (optional)</Label>
                                <Input
                                    className="mt-1"
                                    value={data.customer_gstin}
                                    onChange={(e) => setData('customer_gstin', e.target.value)}
                                    placeholder="For B2B / tax invoice"
                                />
                                <InputError message={errors.customer_gstin} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-sm font-medium">Items</div>
                        {data.items.map((row, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 gap-3 md:grid-cols-12"
                            >
                                <div className="md:col-span-7">
                                    <Label>Product</Label>
                                    <select
                                        className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                                        value={row.product_id}
                                        onChange={(e) => {
                                            const next = [...data.items];
                                            const pid = Number(e.target.value);
                                            const product = productMap.get(pid);
                                            const basePrice = product?.price ?? 0;
                                            next[idx] = {
                                                ...next[idx],
                                                product_id: e.target.value,
                                                unit_price:
                                                    next[idx].unit_price === '' ||
                                                    next[idx].unit_price == null
                                                        ? Number(basePrice)
                                                        : next[idx].unit_price,
                                            };
                                            setData('items', next);
                                        }}
                                    >
                                        <option value="">Select product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={String(p.id)}>
                                                {p.title}
                                                {p.sku ? ` (${p.sku})` : ''} — base{' '}
                                                {formatMoney(p.price, { showDecimals: true })}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={(errors as any)[`items.${idx}.product_id`]}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Qty</Label>
                                    <Input
                                        className="mt-1"
                                        type="number"
                                        min={1}
                                        value={row.quantity}
                                        onChange={(e) => {
                                            const next = [...data.items];
                                            next[idx] = {
                                                ...next[idx],
                                                quantity: Number(e.target.value),
                                            };
                                            setData('items', next);
                                        }}
                                    />
                                    <InputError
                                        message={(errors as any)[`items.${idx}.quantity`]}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Unit price (optional)</Label>
                                    <Input
                                        className="mt-1"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={row.unit_price ?? ''}
                                        onChange={(e) => {
                                            const next = [...data.items];
                                            next[idx] = {
                                                ...next[idx],
                                                unit_price:
                                                    e.target.value === ''
                                                        ? ''
                                                        : Number(e.target.value),
                                            };
                                            setData('items', next);
                                        }}
                                        placeholder="Override"
                                    />
                                    <InputError
                                        message={(errors as any)[`items.${idx}.unit_price`]}
                                    />
                                </div>
                                <div className="md:col-span-1 flex items-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            const next = data.items.filter(
                                                (_, i) => i !== idx
                                            );
                                            setData(
                                                'items',
                                                next.length
                                                    ? next
                                                    : [
                                                          {
                                                              product_id: '',
                                                              quantity: 1,
                                                              unit_price: '',
                                                          },
                                                      ]
                                            );
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                                setData('items', [
                                    ...data.items,
                                    { product_id: '', quantity: 1, unit_price: '' },
                                ])
                            }
                        >
                            Add item
                        </Button>
                    </div>

                    <div className="text-sm text-gray-700">
                        Subtotal:{' '}
                        <span className="font-medium">
                            {formatMoney(subtotal, { showDecimals: true })}
                        </span>
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}

