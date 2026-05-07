import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import HeadingSmall from '@/components/ui/typography/heading-small';
import AppLayout from '@/layouts/dealer/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import { type BreadcrumbItem, type SharedData } from '@/types';

type FormType = {
    // Product / stock
    product_id: string;
    quantity: number;
    unit_price: string;
    serial_numbers: string[];
    // Customer details
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
};

type Props = {
    commissionPercentage: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Retail Sales', href: route('dealer.retail-sales.index') },
    { title: 'Create', href: route('dealer.retail-sales.create') },
];

/** Apply commission to a purchase price and round up to the next integer. */
function applyCommission(purchasePrice: number, commissionPct: number): number {
    if (commissionPct <= 0) {
        return Math.ceil(purchasePrice);
    }
    return Math.ceil(purchasePrice * (1 + commissionPct / 100));
}

export default function DealerRetailSaleCreate() {
    const { commissionPercentage } = usePage<SharedData>().props as any as Props;

    const [availableSerials, setAvailableSerials] = useState<string[]>([]);
    const [purchasePrice, setPurchasePrice] = useState<number | null>(null);

    const initialValues: FormType = {
        product_id: '',
        quantity: 1,
        unit_price: '',
        serial_numbers: [],
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
    };

    const { submit, inputDivData, processing, data, setData, errors } = useFormHandler<FormType>({
        url: route('dealer.retail-sales.store'),
        initialValues,
        method: 'POST',
    });

    const dataRef = useRef(data);
    dataRef.current = data;

    async function fetchSerials(productId: string) {
        if (!productId) { setAvailableSerials([]); return; }
        try {
            const { data: result } = await axios.get(
                route('dealer.products.serials', productId),
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
            );
            setAvailableSerials(result.serial_numbers ?? []);
            setData('serial_numbers', []);
            setData('quantity', 1);
        } catch {
            setAvailableSerials([]);
        }
    }

    async function fetchProductPrice(productId: string) {
        if (!productId) { setPurchasePrice(null); return; }
        try {
            const { data: result } = await axios.get(
                route('dealer.products.price', productId),
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
            );
            const base: number = result.purchase_price ?? 0;
            setPurchasePrice(base);
            const sellPrice = applyCommission(base, commissionPercentage);
            setData('unit_price', String(sellPrice));
        } catch {
            setPurchasePrice(null);
        }
    }

    function toggleSerial(sn: string) {
        const current = dataRef.current.serial_numbers;
        const next = current.includes(sn) ? current.filter(s => s !== sn) : [...current, sn];
        setData('serial_numbers', next);
        setData('quantity', next.length || 1);
    }

    const isSerialized = availableSerials.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record retail sale" />
            <HeadingSmall
                title="Record retail sale"
                description="Record a consumer sale and reduce your stock."
            />

            {commissionPercentage > 0 && (
                <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                    Commission: <span className="font-semibold">{commissionPercentage}%</span> — sell price is auto-calculated as purchase price + commission, rounded up to the next integer.
                </div>
            )}

            <FormContainer onSubmit={submit} processing={processing} buttonLabel="Record sale">

                {/* ── Customer & billing ── */}
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Customer &amp; billing</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Used for tax invoices and warranty registration.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputDiv
                        type="text"
                        label="Customer name"
                        name="customer_name"
                        inputDivData={inputDivData}
                        required
                        placeholder="Full name"
                    />
                    <InputDiv
                        type="tel"
                        label="Phone"
                        name="customer_phone"
                        inputDivData={inputDivData}
                        required
                        placeholder="Mobile number"
                    />
                    <div className="sm:col-span-2">
                        <InputDiv
                            type="email"
                            label="Email (optional)"
                            name="customer_email"
                            inputDivData={inputDivData}
                            placeholder="customer@example.com"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <InputDiv
                            type="text"
                            label="Address line 1"
                            name="billing_address_line1"
                            inputDivData={inputDivData}
                            required
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <InputDiv
                            type="text"
                            label="Address line 2 (optional)"
                            name="billing_address_line2"
                            inputDivData={inputDivData}
                        />
                    </div>
                    <InputDiv
                        type="text"
                        label="City"
                        name="billing_city"
                        inputDivData={inputDivData}
                        required
                    />
                    <InputDiv
                        type="text"
                        label="State / province"
                        name="billing_state"
                        inputDivData={inputDivData}
                        required
                    />
                    <InputDiv
                        type="text"
                        label="PIN / postal code"
                        name="billing_pincode"
                        inputDivData={inputDivData}
                        required
                    />
                    <InputDiv
                        type="text"
                        label="Country"
                        name="billing_country"
                        inputDivData={inputDivData}
                        required
                    />
                    <div className="sm:col-span-2">
                        <InputDiv
                            type="text"
                            label="GSTIN (optional)"
                            name="customer_gstin"
                            inputDivData={inputDivData}
                            placeholder="For B2B / tax invoice"
                        />
                    </div>
                </div>

                {/* ── Product ── */}
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                    <p className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">Product</p>
                </div>

                <InputDiv
                    type="async-select"
                    label="Product"
                    name="product_id"
                    inputDivData={{
                        ...inputDivData,
                        setData: async (key: string, value: any) => {
                            (inputDivData.setData as (k: string, v: any) => void)(key, value);
                            if (key === 'product_id') {
                                fetchSerials(value);
                                fetchProductPrice(value);
                            }
                        },
                    }}
                    required
                    fetchRouteName="dealer.products.search"
                    fetchQueryParam="q"
                    minSearchLength={2}
                    placeholder="Type at least 2 characters to search…"
                />

                {/* Serial number selector (checkbox style) */}
                {isSerialized ? (
                    <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/40">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Select serial numbers to sell
                                <span className="ml-1 text-red-500">*</span>
                            </span>
                            <span className="text-xs text-gray-500">
                                {data.serial_numbers.length} of {availableSerials.length} selected
                            </span>
                        </div>
                        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
                            {availableSerials.map((sn) => (
                                <label
                                    key={sn}
                                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.serial_numbers.includes(sn)}
                                        onChange={() => toggleSerial(sn)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                    />
                                    <span className="font-mono text-sm">{sn}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-3 text-xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setData('serial_numbers', availableSerials);
                                    setData('quantity', availableSerials.length);
                                }}
                                className="text-blue-600 hover:underline"
                            >
                                Select all
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setData('serial_numbers', []);
                                    setData('quantity', 1);
                                }}
                                className="text-gray-500 hover:underline"
                            >
                                Clear
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Quantity: <span className="font-medium">{data.serial_numbers.length}</span>
                        </p>
                        {(errors as any)?.serial_numbers && (
                            <p className="text-sm text-red-600">{(errors as any).serial_numbers}</p>
                        )}
                    </div>
                ) : (
                    <InputDiv
                        type="number"
                        label="Quantity"
                        name="quantity"
                        inputDivData={inputDivData}
                        min={1}
                        required
                    />
                )}

                {/* Sell price */}
                <div className="space-y-1">
                    <InputDiv
                        type="number"
                        label="Sell price"
                        name="unit_price"
                        inputDivData={inputDivData}
                        min={0}
                        step="1"
                        placeholder="Auto-calculated from purchase price + commission"
                    />
                    {purchasePrice !== null && commissionPercentage > 0 && (
                        <p className="text-xs text-gray-500">
                            Purchase price: <span className="font-medium">{purchasePrice}</span> + {commissionPercentage}% commission → rounded up to <span className="font-semibold">{applyCommission(purchasePrice, commissionPercentage)}</span>
                        </p>
                    )}
                </div>

            </FormContainer>
        </AppLayout>
    );
}
