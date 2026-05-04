import { Head } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/distributor/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem } from '@/types';

type FormType = {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dealers', href: '/distributor/dealer' },
    { title: 'Add dealer', href: '/distributor/dealer/create' },
];

export default function DealerCreate() {
    const initialValues: FormType = {
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('distributor.dealer.store'),
        initialValues,
        method: 'POST',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add dealer" />
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Create dealer"
            >
                <InputDiv
                    type="text"
                    label="Full name"
                    name="name"
                    inputDivData={inputDivData}
                    required
                    autoComplete="name"
                />
                <InputDiv
                    type="email"
                    label="Email"
                    name="email"
                    inputDivData={inputDivData}
                    required
                    autoComplete="email"
                />
                <InputDiv
                    type="tel"
                    label="Phone (optional)"
                    name="phone"
                    inputDivData={inputDivData}
                    autoComplete="tel"
                />
                <InputDiv
                    type="password"
                    label="Temporary password"
                    name="password"
                    inputDivData={inputDivData}
                    required
                    autoComplete="new-password"
                />
                <InputDiv
                    type="password"
                    label="Confirm password"
                    name="password_confirmation"
                    inputDivData={inputDivData}
                    required
                    autoComplete="new-password"
                />
            </FormContainer>
        </AppLayout>
    );
}
