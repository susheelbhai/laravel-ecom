import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/distributor/app-layout';
import SerialStatusList from '@/components/Stock/SerialStatusList';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('distributor.dashboard') },
    { title: 'Stolen Serials', href: '#' },
];

export default function DistributorStolenSerials() {
    const { serials } = usePage<SharedData>().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stolen Serial Numbers" />
            <h1 className="mb-4 text-lg font-semibold">Stolen Serial Numbers</h1>
            <SerialStatusList serials={serials} lookupRoute={route('distributor.serial-numbers.lookup')} />
        </AppLayout>
    );
}
