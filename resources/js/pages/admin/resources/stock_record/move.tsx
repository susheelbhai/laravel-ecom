import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
    rack_id: string;
    quantity: number;
    reason: string;
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
    const { stockRecord, warehouses } = usePage<SharedData>().props as any;
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    const initialValues: FormType = {
        rack_id: '',
        quantity: stockRecord?.quantity || 0,
        reason: '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.stock.records.move', stockRecord?.id),
        initialValues,
        method: 'POST',
        
    });

    const selectedWarehouseData = warehouses?.find(
        (w: any) => w.id.toString() === selectedWarehouse,
    );
    const racks = selectedWarehouseData?.racks || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Move Stock Record" />
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold">Current Location</h3>
                <div className="mt-2 text-sm text-gray-600">
                    <p>
                        <span className="font-medium">Product:</span>{' '}
                        {stockRecord?.product?.title} (
                        {stockRecord?.product?.sku})
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
                    </p>
                </div>
            </div>
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Move Stock"
            >
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
                <InputDiv
                    type="number"
                    label="Quantity to Move"
                    name="quantity"
                    inputDivData={inputDivData}
                    placeholder="Enter quantity"
                    help={`Available: ${stockRecord?.quantity} units`}
                />
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
