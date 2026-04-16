import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';

type FormType = {
    id: number;
    image: string | File;
    href: string;
    target: string;
    display_order: number;
    is_active: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Page Banner',
        href: '/admin/product-page-banner',
    },
    {
        title: 'Edit',
        href: '/dashboard',
    },
];

export default function Edit() {
    const data =
        ((usePage<SharedData>().props as any)?.data as FormType) || {};

    const initialValues: FormType = {
        id: data.id,
        image: data.image,
        href: data.href || '',
        target: data.target || '_self',
        display_order: data.display_order || 0,
        is_active: data.is_active || 1,
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.product-page-banner.update', data.id),
        initialValues,
        method: 'PATCH',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product Page Banner" />
            <FormContainer onSubmit={submit} processing={processing}>
                <InputDiv
                    type="image"
                    label="Banner Image"
                    name="image"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="text"
                    label="Link URL (href)"
                    name="href"
                    inputDivData={inputDivData}
                    placeholder="https://example.com"
                />
                <InputDiv
                    type="select"
                    label="Link Target"
                    name="target"
                    inputDivData={inputDivData}
                    options={[
                        { value: '_self', label: 'Same Tab (_self)' },
                        { value: '_blank', label: 'New Tab (_blank)' },
                        { value: '_parent', label: 'Parent Frame (_parent)' },
                        { value: '_top', label: 'Full Window (_top)' },
                    ]}
                />
                <InputDiv
                    type="number"
                    label="Display Order"
                    name="display_order"
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
