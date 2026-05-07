import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import HeadingSmall from '@/components/ui/typography/heading-small';
import AppLayout from '@/layouts/distributor/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import { type BreadcrumbItem, type SharedData } from '@/types';
import PaymentInitialSection from '@/components/payment/PaymentInitialSection';

type FormType = {
    dealer_id: string;
    product_id: string;
    quantity: number;
    unit_price: string;
    serial_numbers: string[];
    payment_status: string;
    amount_paid: string;
    payment_method: string;
    note: string;
    payment_proof: File | null;
};

type Props = {
    dealers: { id: number; name: string; email: string }[];
    commissionPercentage: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dealer Orders', href: route('distributor.dealer-orders.index') },
    { title: 'Create', href: route('distributor.dealer-orders.create') },
];

/** Apply commission to a purchase price and round up to the next integer. */
function applyCommission(purchasePrice: number, commissionPct: number): number {
    if (commissionPct <= 0) {
        return Math.ceil(purchasePrice);
    }
    return Math.ceil(purchasePrice * (1 + commissionPct / 100));
}

export default function DistributorDealerOrderCreate() {
    const { dealers, commissionPercentage } = usePage<SharedData>().props as any as Props;
    const [availableSerials, setAvailableSerials] = useState<string[]>([]);
    const [purchasePrice, setPurchasePrice] = useState<number | null>(null);

    const initialValues: FormType = {
        dealer_id: '',
        product_id: '',
        quantity: 1,
        unit_price: '',
        serial_numbers: [],
        payment_status: 'unpaid',
        amount_paid: '',
        payment_method: '',
        note: '',
        payment_proof: null,
    };

    const { submit, inputDivData, processing, data, setData, errors } = useFormHandler<FormType>({
        url: route('distributor.dealer-orders.store'),
        initialValues,
        method: 'POST',
    });

    // Keep a ref so async callbacks always see the latest data
    const dataRef = useRef(data);
    dataRef.current = data;

    async function fetchSerials(productId: string) {
        if (!productId) { setAvailableSerials([]); return; }
        try {
            const { data: result } = await axios.get(
                route('distributor.products.serials', productId),
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
                route('distributor.products.price', productId),
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
            );
            const base: number = result.distributor_price ?? result.price ?? 0;
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
            <Head title="Create dealer order" />
            <HeadingSmall
                title="Create dealer order"
                description="Stock will transfer from your inventory to the dealer's inventory immediately."
            />

            {commissionPercentage > 0 && (
                <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                    Commission: <span className="font-semibold">{commissionPercentage}%</span> — sell price is auto-calculated as purchase price + commission, rounded up to the next integer.
                </div>
            )}

            <FormContainer onSubmit={submit} processing={processing} buttonLabel="Place dealer order">
                <InputDiv
                    type="select"
                    label="Dealer"
                    name="dealer_id"
                    inputDivData={inputDivData}
                    options={dealers.map((d) => ({ id: d.id, title: `${d.name} (${d.email})` }))}
                    required
                />
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
                    fetchRouteName="distributor.products.search"
                    fetchQueryParam="q"
                    minSearchLength={2}
                    placeholder="Type at least 2 characters to search…"
                />

                {/* Serial number selector */}
                {isSerialized ? (
                    <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/40">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Select serial numbers to transfer
                                <span className="ml-1 text-red-500">*</span>
                            </span>
                            <span className="text-xs text-gray-500">
                                {data.serial_numbers.length} of {availableSerials.length} selected
                            </span>
                        </div>
                        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
                            {availableSerials.map((sn) => (
                                <label key={sn} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800">
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
                            <button type="button" onClick={() => { setData('serial_numbers', availableSerials); setData('quantity', availableSerials.length); }} className="text-blue-600 hover:underline">Select all</button>
                            <button type="button" onClick={() => { setData('serial_numbers', []); setData('quantity', 1); }} className="text-gray-500 hover:underline">Clear</button>
                        </div>
                        <p className="text-sm text-gray-600">Quantity to transfer: <span className="font-medium">{data.serial_numbers.length}</span></p>
                        {(errors as any)?.serial_numbers && <p className="text-sm text-red-600">{(errors as any).serial_numbers}</p>}
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

                <PaymentInitialSection
                    data={data as Record<string, any>}
                    setData={(key, value) => setData(key as keyof FormType, value)}
                    errors={Object.fromEntries(
                        Object.entries(errors as Record<string, any>).map(([k, v]) => [k, String(v ?? '')])
                    )}
                />
            </FormContainer>
        </AppLayout>
    );
}
