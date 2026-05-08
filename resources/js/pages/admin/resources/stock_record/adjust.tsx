import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
    adjustment: string;
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
        title: 'Adjust Quantity',
        href: '#',
    },
];

export default function AdjustStockRecord() {
    const { stockRecord } = usePage<SharedData>().props as any;
    const [newQuantity, setNewQuantity] = useState(stockRecord?.quantity || 0);

    const initialValues: FormType = {
        adjustment: '0',
        reason: '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.stock.records.adjust', stockRecord?.id),
        initialValues,
        method: 'POST',
        
    });

    useEffect(() => {
        const adjustment = parseInt(inputDivData.data.adjustment) || 0;
        setNewQuantity((stockRecord?.quantity || 0) + adjustment);
    }, [inputDivData.data.adjustment, stockRecord?.quantity]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Adjust Stock Quantity" />
            <div className="mb-4 rounded-div bg-gray-50 p-4">
                <h3 className="font-semibold">Stock Record Details</h3>
                <div className="mt-2 text-sm text-gray-600">
                    <p>
                        <span className="font-medium">Product:</span>{' '}
                        {stockRecord?.product?.title} (
                        {stockRecord?.product?.sku})
                    </p>
                    <p>
                        <span className="font-medium">Location:</span>{' '}
                        {stockRecord?.rack?.warehouse?.name} -{' '}
                        {stockRecord?.rack?.identifier}
                    </p>
                    <p>
                        <span className="font-medium">Current Quantity:</span>{' '}
                        {stockRecord?.quantity}
                    </p>
                </div>
            </div>
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Adjust Quantity"
            >
                <InputDiv
                    type="number"
                    label="Adjustment (positive to add, negative to subtract)"
                    name="adjustment"
                    inputDivData={inputDivData}
                    placeholder="e.g., 10 or -5"
                />
                <div className="rounded-div bg-blue-50 p-3 text-sm">
                    <p className="font-medium text-blue-900">
                        New Quantity: {newQuantity}
                    </p>
                    {newQuantity < 0 && (
                        <p className="mt-1 text-red-600">
                            Warning: New quantity cannot be negative!
                        </p>
                    )}
                </div>
                <InputDiv
                    type="textarea"
                    label="Reason (optional)"
                    name="reason"
                    inputDivData={inputDivData}
                    placeholder="e.g., Damaged goods, Stock correction, etc."
                />
            </FormContainer>
        </AppLayout>
    );
}
