import { Head } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem } from '@/types';

type FormType = {
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
        title: 'Create',
        href: route('admin.stock.warehouses.create'),
    },
];

export default function CreateWarehouse() {
    const initialValues: FormType = {
        name: '',
        address: '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.stock.warehouses.store'),
        initialValues,
        method: 'POST',
        
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Warehouse" />
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Create Warehouse"
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
