import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FormContainer } from '@/components/form/container/form-container';
import AppLayout from '@/layouts/admin/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ConfigList } from './components/config-list';
import { ValidationErrors } from './components/validation-errors';

type ConfigType = {
    id: number;
    section_type: string;
    is_enabled: boolean;
    display_order: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/admin' },
    { title: 'Recommendation Config', href: '/admin/recommendation-config' },
];

const sectionTitles: Record<string, string> = {
    frequently_bought_together: 'Frequently Bought Together',
    related_products: 'Related Products',
    recently_viewed: 'Recently Viewed',
    co_purchase: 'Customers Who Bought This Also Bought',
    category_best_sellers: 'Best Sellers in Category',
    category_top_rated: 'Top Rated in Category',
};

export default function Index() {
    const { configs: initialConfigs } = usePage().props as any;

    const [configs, setConfigs] = useState<ConfigType[]>(initialConfigs);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    // Log errors when they change
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.error('Form errors:', errors);
        }
    }, [errors]);

    const handleToggle = (id: number) => {
        setConfigs((prev) =>
            prev.map((config) =>
                config.id === id
                    ? { ...config, is_enabled: !config.is_enabled }
                    : config
            )
        );
    };

    const handleReorder = (fromIndex: number, toIndex: number) => {
        const newConfigs = [...configs];
        const [movedItem] = newConfigs.splice(fromIndex, 1);
        newConfigs.splice(toIndex, 0, movedItem);

        // Update display_order for all items
        const reorderedConfigs = newConfigs.map((config, index) => ({
            ...config,
            display_order: index + 1,
        }));

        setConfigs(reorderedConfigs);
    };

    // Submit handler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.patch(
            route('admin.recommendation-config.update'),
            { configs },
            {
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: (validationErrors) => {
                    console.error('Validation errors:', validationErrors);
                    setErrors(validationErrors as Record<string, string>);
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recommendation Configuration" />

            <div className="rounded-lg border border-border bg-card p-6">
                <h1 className="mb-6 text-2xl font-bold text-foreground">
                    Recommendation Configuration
                </h1>

                <p className="mb-6 text-sm text-muted-foreground">
                    Configure which recommendation sections appear on product
                    detail pages and their display order.
                </p>

                <ValidationErrors errors={errors} />

                <FormContainer
                    onSubmit={handleSubmit}
                    processing={processing}
                    buttonLabel="Save Configuration"
                >
                    <ConfigList
                        configs={configs}
                        sectionTitles={sectionTitles}
                        onToggle={handleToggle}
                        onReorder={handleReorder}
                    />
                </FormContainer>
            </div>
        </AppLayout>
    );
}
