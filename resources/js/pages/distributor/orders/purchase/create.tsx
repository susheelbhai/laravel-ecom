import { Head } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import HeadingSmall from '@/components/ui/typography/heading-small';
import AppLayout from '@/layouts/distributor/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem } from '@/types';

type FormType = {
    product_id: string;
    quantity: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchase Orders', href: route('distributor.purchase-orders.index') },
    { title: 'Create', href: route('distributor.purchase-orders.create') },
];

export default function DistributorPurchaseOrderCreate() {
    const initialValues: FormType = {
        product_id: '',
        quantity: '1',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('distributor.purchase-orders.store'),
        initialValues,
        method: 'POST',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create purchase order" />
            <HeadingSmall
                title="Create purchase order"
                description="Select a product and quantity. An admin will review and fulfil your order."
            />
            <FormContainer onSubmit={submit} processing={processing} buttonLabel="Place purchase order">
                <InputDiv
                    type="async-select"
                    label="Product"
                    name="product_id"
                    inputDivData={inputDivData}
                    required
                    fetchRouteName="distributor.products.search"
                    fetchQueryParam="q"
                    minSearchLength={2}
                    placeholder="Type at least 2 characters to search…"
                />
                <InputDiv
                    type="number"
                    label="Quantity"
                    name="quantity"
                    inputDivData={inputDivData}
                    min={1}
                    required
                />
            </FormContainer>
        </AppLayout>
    );
}
