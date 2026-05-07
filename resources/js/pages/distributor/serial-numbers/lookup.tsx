import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/distributor/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import SerialNumberLookup from '@/components/serial-numbers/SerialNumberLookup';
import { type SerialNumberData, type Movement } from '@/components/serial-numbers/types';

interface PageProps extends SharedData {
    serialNumber: SerialNumberData | null;
    movements: Movement[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Serial Numbers', href: route('distributor.serial-numbers.lookup') },
    { title: 'Lookup', href: '#' },
];

export default function DistributorSerialNumberLookup() {
    const { serialNumber, movements } = usePage<PageProps>().props;

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const currentQuery = params.get('q') ?? '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Serial Number Lookup" />
            <SerialNumberLookup
                serialNumber={serialNumber}
                movements={movements}
                currentQuery={currentQuery}
                lookupUrl={route('distributor.serial-numbers.lookup')}
                markStolenUrl={serialNumber ? route('distributor.serial-numbers.mark-stolen', serialNumber.id) : null}
                markDamagedUrl={serialNumber ? route('distributor.serial-numbers.mark-damaged', serialNumber.id) : null}
            />
        </AppLayout>
    );
}
