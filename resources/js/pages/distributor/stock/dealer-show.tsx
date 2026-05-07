import { Head, usePage } from '@inertiajs/react';
import Pagination from '@/components/table/pagination';
import TableCard from '@/components/table/table-card';
import StockCard from '@/components/Stock/StockCard';
import AppLayout from '@/layouts/distributor/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

export default function DistributorDealerStockShow() {
    const { dealer, data } = usePage<SharedData>().props as any;
    const items = data?.data || [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Stock', href: '/distributor/stock' },
        { title: dealer?.name ?? 'Dealer', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Dealer stock - ${dealer?.name ?? ''}`} />

            <div className="mb-4 text-sm text-gray-600">
                Dealer: {dealer?.name} {dealer?.email ? `(${dealer.email})` : ''}
            </div>

            <TableCard>
                {items.length ? (
                    <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((row: any) => (
                            <StockCard
                                key={row.id}
                                {...row}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-sm text-gray-600">No stock records found.</div>
                )}
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
