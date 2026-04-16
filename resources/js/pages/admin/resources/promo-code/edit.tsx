import { Head, usePage } from '@inertiajs/react';
import { FormContainer } from '@/components/form/container/form-container';
import { InputDiv } from '@/components/form/container/input-div';
import AppLayout from '@/layouts/admin/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import type { BreadcrumbItem } from '@/types';

type FormType = {
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    min_order_amount: number | null;
    max_discount_amount: number | null;
    usage_limit: number | null;
    per_user_limit: number | null;
    partner_id: number | null;
    is_active: boolean;
    valid_from: string;
    valid_until: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Promo Codes',
        href: '/admin/promo-code',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function Edit() {
    const { data, partners } = usePage().props as any;
    const promoCode = data || {};

    const initialValues: FormType = {
        code: promoCode.code || '',
        description: promoCode.description || '',
        discount_type: promoCode.discount_type || 'percentage',
        discount_value: promoCode.discount_value || 0,
        min_order_amount: promoCode.min_order_amount || null,
        max_discount_amount: promoCode.max_discount_amount || null,
        usage_limit: promoCode.usage_limit || null,
        per_user_limit: promoCode.per_user_limit || null,
        partner_id: promoCode.partner_id || null,
        is_active: promoCode.is_active || false,
        valid_from: promoCode.valid_from
            ? promoCode.valid_from.split(' ')[0]
            : '',
        valid_until: promoCode.valid_until
            ? promoCode.valid_until.split(' ')[0]
            : '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('admin.promo-code.update', promoCode.id),
        initialValues,
        method: 'PATCH',
        
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Promo Code" />
            <FormContainer onSubmit={submit} processing={processing}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputDiv
                        type="text"
                        label="Promo Code"
                        name="code"
                        inputDivData={inputDivData}
                        placeholder="e.g., WELCOME10"
                    />
                    <InputDiv
                        type="select"
                        label="Discount Type"
                        name="discount_type"
                        inputDivData={inputDivData}
                        options={[
                            { value: 'percentage', label: 'Percentage' },
                            { value: 'fixed', label: 'Fixed Amount' },
                        ]}
                    />
                </div>

                <InputDiv
                    type="textarea"
                    label="Description"
                    name="description"
                    inputDivData={inputDivData}
                    placeholder="Brief description of the promo code"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputDiv
                        type="number"
                        label="Discount Value"
                        name="discount_value"
                        inputDivData={inputDivData}
                        placeholder={
                            inputDivData.data.discount_type === 'percentage'
                                ? 'e.g., 10 for 10%'
                                : 'e.g., 50 for ₹50'
                        }
                    />
                    <InputDiv
                        type="number"
                        label="Minimum Order Amount"
                        name="min_order_amount"
                        inputDivData={inputDivData}
                        placeholder="Optional"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputDiv
                        type="number"
                        label="Maximum Discount Amount"
                        name="max_discount_amount"
                        inputDivData={inputDivData}
                        placeholder="Optional (for percentage type)"
                    />
                    <InputDiv
                        type="number"
                        label="Total Usage Limit"
                        name="usage_limit"
                        inputDivData={inputDivData}
                        placeholder="Optional"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputDiv
                        type="number"
                        label="Per User Limit"
                        name="per_user_limit"
                        inputDivData={inputDivData}
                        placeholder="Optional"
                    />
                    <InputDiv
                        type="select"
                        label="Partner (Optional)"
                        name="partner_id"
                        inputDivData={inputDivData}
                        options={[
                            { value: '', label: 'No Partner' },
                            ...partners.map((partner: any) => ({
                                value: partner.id,
                                label: partner.name,
                            })),
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputDiv
                        type="date"
                        label="Valid From"
                        name="valid_from"
                        inputDivData={inputDivData}
                    />
                    <InputDiv
                        type="date"
                        label="Valid Until"
                        name="valid_until"
                        inputDivData={inputDivData}
                    />
                </div>

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
