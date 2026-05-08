import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import InputError from '@/components/form/input/input-error';
import { Input } from '@/components/form/input/input';
import { Label } from '@/components/form/input/label';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

const MAX_QUANTITY = 100;
const AUTO_GENERATE_THRESHOLD = 5;

type FormType = {
    product_id: string;
    rack_id: string;
    quantity: string;
    use_serial_numbers: number;
    serial_numbers: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: route('admin.stock.dashboard.index') },
    { title: 'Stock Records', href: route('admin.stock.records.index') },
    { title: 'Create', href: route('admin.stock.records.create') },
];

function generateSerials(qty: number, prefix: string, start: number, increment: number): string[] {
    return Array.from({ length: qty }, (_, i) => {
        const num = start + i * increment;
        return `${prefix}${String(num).padStart(4, '0')}`;
    });
}

export default function CreateStockRecord() {
    const { warehouses } = usePage<SharedData>().props as any;
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    // Auto-generate state
    const [autoPrefix, setAutoPrefix] = useState('SN-');
    const [autoStart, setAutoStart] = useState(1);
    const [autoIncrement, setAutoIncrement] = useState(1);
    const [useAutoGenerate, setUseAutoGenerate] = useState(false);

    const initialValues: FormType = {
        product_id: '',
        rack_id: '',
        quantity: '1',
        use_serial_numbers: 0,
        serial_numbers: [],
    };

    const { submit, inputDivData, processing, data, setData, errors } = useFormHandler<FormType>({
        url: route('admin.stock.records.store'),
        initialValues,
        method: 'POST',
    });

    const selectedWarehouseData = warehouses?.find((w: any) => w.id.toString() === selectedWarehouse);
    const racks = selectedWarehouseData?.racks || [];
    const quantity = parseInt(data.quantity || '0', 10) || 0;
    const useSerialNumbers = data.use_serial_numbers === 1;
    const showAutoGenerate = useSerialNumbers && quantity > AUTO_GENERATE_THRESHOLD;

    const handleSerialToggle = (checked: boolean) => {
        if (!checked) setUseAutoGenerate(false);
        setData('serial_numbers', checked ? Array.from({ length: quantity }, (_, i) => data.serial_numbers[i] ?? '') : []);
    };

    const handleQuantityChange = (value: string) => {
        setData('quantity', value);
        if (useSerialNumbers) {
            const qty = Math.min(parseInt(value || '0', 10) || 0, MAX_QUANTITY);
            if (useAutoGenerate) {
                setData('serial_numbers', generateSerials(qty, autoPrefix, autoStart, autoIncrement));
            } else {
                setData('serial_numbers', Array.from({ length: qty }, (_, i) => data.serial_numbers[i] ?? ''));
            }
        }
    };

    const handleAutoGenerate = () => {
        setData('serial_numbers', generateSerials(quantity, autoPrefix, autoStart, autoIncrement));
    };

    const updateSerial = (index: number, value: string) => {
        const updated = [...data.serial_numbers];
        updated[index] = value;
        setData('serial_numbers', updated);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Stock Record" />
            <FormContainer onSubmit={submit} processing={processing} buttonLabel="Create Stock Record">
                <InputDiv
                    type="async-select"
                    label="Product"
                    name="product_id"
                    inputDivData={inputDivData}
                    required
                    fetchRouteName="admin.stock.products.search"
                    fetchQueryParam="q"
                    minSearchLength={2}
                    placeholder="Type at least 2 characters to search…"
                />

                <InputDiv
                    type="select"
                    label="Warehouse"
                    name="warehouse_id"
                    inputDivData={{
                        ...inputDivData,
                        data: { ...inputDivData.data, warehouse_id: selectedWarehouse },
                        setData: (key: string, value: any) => {
                            if (key === 'warehouse_id') {
                                setSelectedWarehouse(value);
                                inputDivData.setData('rack_id', '');
                            }
                        },
                    }}
                    options={warehouses}
                />

                <InputDiv
                    type="select"
                    label="Rack"
                    name="rack_id"
                    inputDivData={inputDivData}
                    options={racks}
                    disabled={!selectedWarehouse}
                />

                <InputDiv
                    type="number"
                    label={`Quantity (max ${MAX_QUANTITY})`}
                    name="quantity"
                    inputDivData={{
                        ...inputDivData,
                        setData: (key: string, value: any) => {
                            if (key === 'quantity') handleQuantityChange(value);
                            else (inputDivData.setData as (k: string, v: any) => void)(key, value);
                        },
                    }}
                    min="0"
                    max={String(MAX_QUANTITY)}
                />

                <InputDiv
                    type="checkbox"
                    label="Add serial numbers (for warranty tracking)"
                    name="use_serial_numbers"
                    inputDivData={inputDivData}
                    onChange={(e) => handleSerialToggle((e.target as HTMLInputElement).checked)}
                />

                {useSerialNumbers && quantity > 0 && (
                    <div className="space-y-4 rounded-div border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-gray-900/40">

                        {/* Auto-generate panel — only shown when qty > threshold */}
                        {showAutoGenerate && (
                            <div className="rounded-div border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/40">
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
                                    <input
                                        type="checkbox"
                                        checked={useAutoGenerate}
                                        onChange={(e) => {
                                            setUseAutoGenerate(e.target.checked);
                                            if (e.target.checked) {
                                                setData('serial_numbers', generateSerials(quantity, autoPrefix, autoStart, autoIncrement));
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-blue-300 text-blue-600"
                                    />
                                    Auto-generate serial numbers
                                </label>

                                {useAutoGenerate && (
                                    <div className="mt-3 grid grid-cols-3 gap-3">
                                        <div>
                                            <Label className="text-xs">Prefix</Label>
                                            <Input
                                                className="mt-0.5 font-mono"
                                                placeholder="SN-"
                                                value={autoPrefix}
                                                onChange={(e) => {
                                                    setAutoPrefix(e.target.value);
                                                    setData('serial_numbers', generateSerials(quantity, e.target.value, autoStart, autoIncrement));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Starting number</Label>
                                            <Input
                                                type="number"
                                                className="mt-0.5"
                                                min={1}
                                                value={autoStart}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1;
                                                    setAutoStart(val);
                                                    setData('serial_numbers', generateSerials(quantity, autoPrefix, val, autoIncrement));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Increment by</Label>
                                            <Input
                                                type="number"
                                                className="mt-0.5"
                                                min={1}
                                                value={autoIncrement}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1;
                                                    setAutoIncrement(val);
                                                    setData('serial_numbers', generateSerials(quantity, autoPrefix, autoStart, val));
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Per-unit serial inputs */}
                        <div className="space-y-2">
                            {!showAutoGenerate && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Enter a unique serial number for each unit.
                                </p>
                            )}
                            {Array.from({ length: quantity }).map((_, i) => (
                                <div key={i}>
                                    <Label htmlFor={`serial_${i}`} className="text-xs">
                                        Unit {i + 1}
                                    </Label>
                                    <Input
                                        id={`serial_${i}`}
                                        className="mt-0.5 font-mono"
                                        placeholder={`e.g. SN-${String(i + 1).padStart(4, '0')}`}
                                        value={data.serial_numbers[i] ?? ''}
                                        onChange={(e) => updateSerial(i, e.target.value)}
                                    />
                                    <InputError message={(errors as any)?.[`serial_numbers.${i}`]} />
                                </div>
                            ))}
                        </div>

                        {typeof (errors as any)?.serial_numbers === 'string' && (
                            <InputError message={(errors as any).serial_numbers} />
                        )}
                    </div>
                )}
            </FormContainer>
        </AppLayout>
    );
}
