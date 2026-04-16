import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
    id: number;
    name: string;
    address: string;
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
        title: 'Edit',
        href: '#',
    },
];

export default function EditWarehouse() {
    const warehouse =
        ((usePage<SharedData>().props as any)?.warehouse as FormType) || null;

    const initialValues: FormType = {
        id: warehouse?.id || 0,
        name: warehouse?.name || '',
        address: warehouse?.address || '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.stock.warehouses.update', warehouse?.id),
        initialValues,
        method: 'PUT',
        
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Warehouse" />
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Update Warehouse"
            >
                <InputDiv
                    type="text"
                    label="Warehouse Name"
                    name="name"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="textarea"
                    label="Address"
                    name="address"
                    inputDivData={inputDivData}
                />
            </FormContainer>
        </AppLayout>
    );
}
