import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import HeadingSmall from '@/components/ui/typography/heading-small';
import AppLayout from '@/layouts/distributor/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import { type BreadcrumbItem, type SharedData } from '@/types';

type FormType = {
    dealer_id: string;
    product_id: string;
    quantity: string;
    unit_price: string;
};

type Props = {
    dealers: { id: number; name: string; email: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dealer Orders', href: route('distributor.dealer-orders.index') },
    { title: 'Create', href: route('distributor.dealer-orders.create') },
];

export default function DistributorDealerOrderCreate() {
    const { dealers } = usePage<SharedData>().props as any as Props;

    const initialValues: FormType = {
        dealer_id: '',
        product_id: '',
        quantity: '1',
        unit_price: '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('distributor.dealer-orders.store'),
        initialValues,
        method: 'POST',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create dealer order" />
            <HeadingSmall
                title="Create dealer order"
                description="Stock will transfer from your inventory to the dealer's inventory immediately."
            />
            <FormContainer onSubmit={submit} processing={processing} buttonLabel="Place dealer order">
                <InputDiv
                    type="select"
                    label="Dealer"
                    name="dealer_id"
                    inputDivData={inputDivData}
                    options={dealers.map((d) => ({ id: d.id, title: `${d.name} (${d.email})` }))}
                    required
                />
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
                <InputDiv
                    type="number"
                    label="Unit price (optional override)"
                    name="unit_price"
                    inputDivData={inputDivData}
                    min={0}
                    step="0.01"
                    placeholder="Leave blank to use default price"
                />
            </FormContainer>
        </AppLayout>
    );
}
