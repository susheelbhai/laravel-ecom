import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/components/table/pagination';
import TableCard from '@/components/table/table-card';
import SerialsModal from '@/components/Stock/SerialsModal';
import StockCard from '@/components/Stock/StockCard';
import AppLayout from '@/layouts/dealer/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'My Stock', href: '/dealer/stock' }];

export default function DealerStockIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];

    const [modalData, setModalData] = useState<{ productTitle: string; serials: string[] } | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Stock" />

            <div>
                {items.length ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((row: any) => (
                            <StockCard
                                key={row.id}
                                {...row}
                                onSerialsClick={(productTitle, serials) => setModalData({ productTitle, serials })}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-sm text-gray-600">No stock records found.</div>
                )}
                <Pagination data={data} />
            </div>

            {modalData && (
                <SerialsModal
                    open={true}
                    onClose={() => setModalData(null)}
                    productTitle={modalData.productTitle}
                    serials={modalData.serials}
                    lookupRoute={route('dealer.serial-numbers.lookup')}
                />
            )}
        </AppLayout>
    );
}
