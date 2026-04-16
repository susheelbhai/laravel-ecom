import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
    product_id: string;
    rack_id: string;
    quantity: string;
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
        title: 'Create',
        href: route('admin.stock.records.create'),
    },
];

export default function CreateStockRecord() {
    const { warehouses, products } = usePage<SharedData>().props as any;
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    const initialValues: FormType = {
        product_id: '',
        rack_id: '',
        quantity: '0',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.stock.records.store'),
        initialValues,
        method: 'POST',
        
    });

    const selectedWarehouseData = warehouses?.find(
        (w: any) => w.id.toString() === selectedWarehouse,
    );
    const racks = selectedWarehouseData?.racks || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Stock Record" />
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Create Stock Record"
            >
                <InputDiv
                    type="select"
                    label="Product"
                    name="product_id"
                    inputDivData={inputDivData}
                    options={products}
                />
                <InputDiv
                    type="select"
                    label="Warehouse"
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
                    label="Rack"
                    name="rack_id"
                    inputDivData={inputDivData}
                    options={racks}
                    disabled={!selectedWarehouse}
                />
                <InputDiv
                    type="number"
                    label="Quantity"
                    name="quantity"
                    inputDivData={inputDivData}
                    min="0"
                />
            </FormContainer>
        </AppLayout>
    );
}
