import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/dealer/app-layout';
import SerialStatusList from '@/components/Stock/SerialStatusList';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dealer.dashboard') },
    { title: 'Damaged Serials', href: '#' },
];

export default function DealerDamagedSerials() {
    const { serials } = usePage<SharedData>().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Damaged Serial Numbers" />
            <h1 className="mb-4 text-lg font-semibold">Damaged Serial Numbers</h1>
            <SerialStatusList serials={serials} lookupRoute={route('dealer.serial-numbers.lookup')} />
        </AppLayout>
    );
}
