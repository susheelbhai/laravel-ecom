import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/admin/app-layout';
import SerialStatusList from '@/components/Stock/SerialStatusList';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Serial Numbers', href: route('admin.serial-numbers.lookup') },
    { title: 'Stolen', href: '#' },
];

export default function AdminStolenSerials() {
    const { serials } = usePage<SharedData>().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stolen Serial Numbers" />
            <h1 className="mb-4 text-lg font-semibold">Stolen Serial Numbers</h1>
            <SerialStatusList serials={serials} lookupRoute={route('admin.serial-numbers.lookup')} />
        </AppLayout>
    );
}
