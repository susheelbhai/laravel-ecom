import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem } from '@/types';

type FormType = {
    name: string;
    roles: number[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permission',
        href: '/admin/permission',
    },
    {
        title: 'Create',
        href: '/dashboard',
    },
];

export default function CreatePermission() {
    const roles = usePage().props.roles as any;

    const initialValues: FormType = {
        name: '',
        roles: [],
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.permission.store'),
        initialValues,
        method: 'POST',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Permission" />
            <FormContainer onSubmit={submit} processing={processing}>
                <InputDiv
                    type="text"
                    label="Name"
                    name="name"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="multicheckbox"
                    label="Roles"
                    name="roles"
                    inputDivData={inputDivData}
                    options={roles}
                />
            </FormContainer>
        </AppLayout>
    );
}
