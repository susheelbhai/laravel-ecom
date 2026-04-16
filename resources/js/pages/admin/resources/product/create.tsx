import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem, SharedData } from '@/types';
import Form from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/admin/product' },
    { title: 'Create', href: '/admin/product/create' },
];

export default function Create() {
    const categories =
        ((usePage<SharedData>().props as any)
            ?.categories as CategoryOption[]) || [];

    const initialValues: FormType = {
        seller_id: '',
        product_category_id: 0,

        title: '',
        slug: '',
        sku: '',

        short_description: '',
        description: '',
        long_description2: '',
        long_description3: '',
        features: [],

        price: 0,
        original_price: 0,
        mrp: 0,

        manage_stock: 1,

        images: null,

        is_active: 1,
        is_featured: 0,

        meta_title: '',
        meta_description: '',
    };

    // ✅ prevent TS deep instantiation
    const form = useFormHandler<FormType>({
        url: route('admin.product.store'),
        initialValues,
        method: 'POST',
        
    });

    const { submit, inputDivData, processing } = form;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <Form
                submit={submit}
                inputDivData={inputDivData}
                processing={processing}
                categories={categories}
            />
        </AppLayout>
    );
}
