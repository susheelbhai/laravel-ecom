import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
    warehouse_id: number;
    identifier: string;
    description: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Management',
        href: route('admin.stock.dashboard.index'),
    },
    {
        title: 'Warehouses',
        href: route('admin.stock.warehouses.index'),
    },
    {
        title: 'Racks',
        href: '#',
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function CreateRack() {
    const warehouse = (usePage<SharedData>().props as any)?.warehouse as any;

    const initialValues: FormType = {
        warehouse_id: warehouse?.id || 0,
        identifier: '',
        description: '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.stock.warehouses.racks.store', warehouse?.id),
        initialValues,
        method: 'POST',
        
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create Rack - ${warehouse?.name}`} />

            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    Create Rack in {warehouse?.name}
                </h2>
                <p className="text-sm text-gray-600">{warehouse?.address}</p>
            </div>

            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Create Rack"
            >
                <InputDiv
                    type="text"
                    label="Rack Identifier"
                    name="identifier"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="textarea"
                    label="Description (Optional)"
                    name="description"
                    inputDivData={inputDivData}
                />
            </FormContainer>
        </AppLayout>
    );
}
