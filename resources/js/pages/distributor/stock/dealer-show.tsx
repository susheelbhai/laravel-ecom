import { Head, usePage } from '@inertiajs/react';
import Pagination from '@/components/table/pagination';
import TableCard from '@/components/table/table-card';
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
                            <div
                                key={row.id}
                                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                            >
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="relative aspect-[16/9] w-full bg-gray-100">
                                        {row.thumbnail ? (
                                            <img
                                                src={row.thumbnail}
                                                alt={row.product_title}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                                                No image available
                                            </div>
                                        )}

                                        {Number(row.quantity) > 0 &&
                                            Number(row.quantity) <= 10 && (
                                                <div className="absolute right-3 top-3 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow">
                                                    Limited
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="text-lg font-semibold text-gray-900 line-clamp-2">
                                        {row.product_title}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                        SKU: {row.sku ?? '—'}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            On hand
                                        </div>
                                        <div className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                                            {row.quantity}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-sm text-gray-600">
                        No stock records found.
                    </div>
                )}
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}

