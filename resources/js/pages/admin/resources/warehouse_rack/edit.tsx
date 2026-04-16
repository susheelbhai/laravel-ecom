import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
    id: number;
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
        title: 'Edit',
        href: '#',
    },
];

export default function EditRack() {
    const rack =
        ((usePage<SharedData>().props as any)?.rack as FormType) || null;

    const initialValues: FormType = {
        id: rack?.id || 0,
        warehouse_id: rack?.warehouse_id || 0,
        identifier: rack?.identifier || '',
        description: rack?.description || '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.stock.racks.update', rack?.id),
        initialValues,
        method: 'PUT',
        
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Rack" />
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Update Rack"
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
