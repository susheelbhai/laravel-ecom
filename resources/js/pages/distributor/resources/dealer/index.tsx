import { Head, usePage } from '@inertiajs/react';
import ButtonCreate from '@/components/ui/button/button-create';
import Pagination from '@/components/table/pagination';
import PersonCard from '@/components/ui/person-card';
import AppLayout from '@/layouts/distributor/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dealers', href: '/distributor/dealer' },
];

export default function DealerIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dealers" />

            <ButtonCreate
                href={route('distributor.dealer.create')}
                text="Add dealer"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 my-4">
                {items.map((row: any) => (
                    <PersonCard
                        key={row.id}
                        name={row.name}
                        email={row.email}
                        phone={row.phone}
                        status={row.application_status}
                        date={row.created_at}
                        href={route('distributor.dealer.show', row.id)}
                    />
                ))}
            </div>

            <div className="mt-4">
                <Pagination data={data} />
            </div>
        </AppLayout>
    );
}
