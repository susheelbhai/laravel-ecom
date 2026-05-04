import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
    name: string;
    url: string;
    logo: string | File;
    is_active: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Portfolio',
        href: '/admin/portfolio',
    },
    {
        title: 'Edit',
        href: '/dashboard',
    },
];

export default function Edit() {
    const portfolio =
        ((usePage<SharedData>().props as any)?.data as {
            id: number;
            name: string;
            url: string;
            is_active: number;
            logo: string;
        }) || {};

    const initialValues: FormType = {
        name: portfolio.name || '',
        url: portfolio.url || '',
        logo: portfolio.logo || '',
        is_active: portfolio.is_active ?? 1,
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.portfolio.update', portfolio.id),
        initialValues,
        method: 'PUT',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Portfolio" />
            <FormContainer onSubmit={submit} processing={processing}>
                <InputDiv
                    type="text"
                    label="Name"
                    name="name"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="text"
                    label="URL"
                    name="url"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="image"
                    label="Logo"
                    name="logo"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="switch"
                    label="Active"
                    name="is_active"
                    inputDivData={inputDivData}
                />
            </FormContainer>
        </AppLayout>
    );
}
