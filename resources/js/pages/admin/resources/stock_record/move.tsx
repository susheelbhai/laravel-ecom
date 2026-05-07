import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type SerialNumberOption = {
    id: number;
    serial_number: string;
};

type FormType = {
    rack_id: string;
    quantity: number;
    reason: string;
    serial_numbers: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Management',
        href: route('admin.stock.dashboard.index'),
    },
    {
        title: 'Stock Records',
        href: route('admin.stock.records.index'),
    },
    {
        title: 'Move',
        href: '#',
    },
];

export default function MoveStockRecord() {
    const { stockRecord, warehouses, availableSerialNumbers } = usePage<SharedData>().props as any;
    const serialOptions: SerialNumberOption[] = availableSerialNumbers ?? [];
    const isSerialized = serialOptions.length > 0;

    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    const initialValues: FormType = {
        rack_id: '',
        quantity: isSerialized ? 0 : (stockRecord?.quantity || 0),
        reason: '',
        serial_numbers: [],
    };

    const { submit, inputDivData, data, setData, errors, processing } = useFormHandler<FormType>({
        url: route('admin.stock.records.move', stockRecord?.id),
        initialValues,
        method: 'POST',
    });

    const selectedWarehouseData = warehouses?.find(
        (w: any) => w.id.toString() === selectedWarehouse,
    );
    const racks = selectedWarehouseData?.racks || [];

    // Toggle a serial number in/out of the selection.
    function toggleSerial(serialNumber: string) {
        const current: string[] = data.serial_numbers ?? [];
        const next = current.includes(serialNumber)
            ? current.filter((s) => s !== serialNumber)
            : [...current, serialNumber];
        setData('serial_numbers', next);
        // Keep quantity in sync with selection count for serialised products.
        setData('quantity', next.length);
    }

    const selectedSerials: string[] = data.serial_numbers ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Move Stock Record" />

            {/* Current location summary */}
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold">Current Location</h3>
                <div className="mt-2 text-sm text-gray-600">
                    <p>
                        <span className="font-medium">Product:</span>{' '}
                        {stockRecord?.product?.title} ({stockRecord?.product?.sku})
                    </p>
                    <p>
                        <span className="font-medium">Current Warehouse:</span>{' '}
                        {stockRecord?.rack?.warehouse?.name}
                    </p>
                    <p>
                        <span className="font-medium">Current Rack:</span>{' '}
                        {stockRecord?.rack?.identifier}
                    </p>
                    <p>
                        <span className="font-medium">Quantity:</span>{' '}
                        {stockRecord?.quantity}
                        {isSerialized && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                Serialised product
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Move Stock"
            >
                {/* Target warehouse / rack */}
                <InputDiv
                    type="select"
                    label="Target Warehouse"
                    name="warehouse_id"
                    inputDivData={{
                        ...inputDivData,
                        data: {
                            ...inputDivData.data,
                            warehouse_id: selectedWarehouse,
                        },
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
                    label="Target Rack"
                    name="rack_id"
                    inputDivData={inputDivData}
                    options={racks}
                    disabled={!selectedWarehouse}
                />

                {/* Serial number selection for serialised products */}
                {isSerialized ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                                Select Serial Numbers to Move
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <span className="text-xs text-gray-500">
                                {selectedSerials.length} of {serialOptions.length} selected
                            </span>
                        </div>

                        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                            {serialOptions.map((opt) => {
                                const checked = selectedSerials.includes(opt.serial_number);
                                return (
                                    <label
                                        key={opt.id}
                                        className="flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 hover:bg-gray-100"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleSerial(opt.serial_number)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="font-mono text-sm text-gray-800">
                                            {opt.serial_number}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        {/* Select all / clear */}
                        <div className="flex gap-3 text-xs">
                            <button
                                type="button"
                                onClick={() => {
                                    const all = serialOptions.map((o) => o.serial_number);
                                    setData('serial_numbers', all);
                                    setData('quantity', all.length);
                                }}
                                className="text-blue-600 hover:underline"
                            >
                                Select all
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setData('serial_numbers', []);
                                    setData('quantity', 0);
                                }}
                                className="text-gray-500 hover:underline"
                            >
                                Clear
                            </button>
                        </div>

                        {/* Quantity display (read-only, driven by selection) */}
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Quantity to move:</span>{' '}
                            {selectedSerials.length}
                        </p>

                        {/* Validation error */}
                        {(errors as any)?.serial_numbers && (
                            <p className="text-sm text-red-600">
                                {(errors as any).serial_numbers}
                            </p>
                        )}

                        {/* Hidden inputs so the form submits the array */}
                        {selectedSerials.map((sn, i) => (
                            <input key={i} type="hidden" name={`serial_numbers[${i}]`} value={sn} />
                        ))}
                        <input type="hidden" name="quantity" value={selectedSerials.length} />
                    </div>
                ) : (
                    <InputDiv
                        type="number"
                        label="Quantity to Move"
                        name="quantity"
                        inputDivData={inputDivData}
                        placeholder="Enter quantity"
                        help={`Available: ${stockRecord?.quantity} units`}
                    />
                )}

                <InputDiv
                    type="text"
                    label="Reason (Optional)"
                    name="reason"
                    inputDivData={inputDivData}
                    placeholder="e.g., Reorganizing warehouse"
                />
            </FormContainer>
        </AppLayout>
    );
}
