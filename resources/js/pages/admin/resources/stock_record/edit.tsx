import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
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
        title: 'Edit',
        href: '#',
    },
];

export default function EditStockRecord() {
    const { stockRecord } = usePage<SharedData>().props as any;

    const initialValues: FormType = {
        quantity: stockRecord?.quantity?.toString() || '0',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.stock.records.update', stockRecord?.id),
        initialValues,
        method: 'PUT',
        
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Stock Record" />
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
                </div>
            </div>
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Update Stock Record"
            >
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
