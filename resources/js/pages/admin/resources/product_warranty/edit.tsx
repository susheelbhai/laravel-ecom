import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import InputError from '@/components/form/input/input-error';
import { Input } from '@/components/form/input/input';
import { Label } from '@/components/form/input/label';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

type Props = {
    product: { id: number; title: string; sku?: string };
    warranty: { id: number; duration: number; duration_unit: string; terms: string | null } | null;
};

export default function ProductWarrantyEdit() {
    const { product, warranty } = usePage<SharedData>().props as any as Props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: route('admin.product.index') },
        { title: product.title, href: route('admin.product.show', product.id) },
        { title: 'Warranty', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        duration: warranty?.duration ?? 1,
        duration_unit: warranty?.duration_unit ?? 'years',
        terms: warranty?.terms ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.product.warranty.update', product.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Warranty — ${product.title}`} />

            <div className="mx-auto max-w-2xl p-4">
                <div className="mb-4">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Warranty — {product.title}
                    </h1>
                    {product.sku && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                    )}
                </div>

                <FormContainer
                    onSubmit={submit}
                    processing={processing}
                    buttonLabel={warranty ? 'Update warranty' : 'Save warranty'}
                    className="space-y-5"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                                id="duration"
                                type="number"
                                min={1}
                                max={9999}
                                className="mt-1"
                                value={data.duration}
                                onChange={(e) => setData('duration', Number(e.target.value))}
                            />
                            <InputError message={errors.duration} />
                        </div>

                        <div>
                            <Label htmlFor="duration_unit">Unit</Label>
                            <select
                                id="duration_unit"
                                className="mt-1 h-9 w-full rounded-div border border-input bg-transparent px-3 text-sm"
                                value={data.duration_unit}
                                onChange={(e) => setData('duration_unit', e.target.value)}
                            >
                                <option value="days">Days</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                            <InputError message={errors.duration_unit} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="terms">Terms &amp; conditions</Label>
                        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                            These terms will be printed on every warranty card generated for this product.
                        </p>
                        <textarea
                            id="terms"
                            rows={8}
                            className="mt-1 w-full rounded-div border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={data.terms}
                            onChange={(e) => setData('terms', e.target.value)}
                            placeholder="e.g. This warranty covers manufacturing defects only. Damage due to misuse is not covered..."
                        />
                        <InputError message={errors.terms} />
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}
