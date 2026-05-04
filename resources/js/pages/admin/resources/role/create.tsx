import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem } from '@/types';

type FormType = {
    name: string;
    permissions: number[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role',
        href: '/admin/role',
    },
    {
        title: 'Create',
        href: '/dashboard',
    },
];

export default function CreateRole() {
    const permissions = usePage().props.permissions as any;

    const initialValues: FormType = {
        name: '',
        permissions: [],
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.role.store'),
        initialValues,
        method: 'POST',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <FormContainer onSubmit={submit} processing={processing}>
                <InputDiv
                    type="text"
                    label="Name"
                    name="name"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="multicheckbox"
                    label="Permissions"
                    name="permissions"
                    inputDivData={inputDivData}
                    options={permissions}
                />
            </FormContainer>
        </AppLayout>
    );
}
