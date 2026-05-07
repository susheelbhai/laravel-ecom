import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/distributor/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import OutstandingBalanceCard from '@/components/ui/outstanding-balance-card';

export default function DistributorDealerShow() {
    const { data } = usePage<SharedData>().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dealers', href: route('distributor.dealer.index') },
        { title: data?.name ?? 'Dealer', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data?.name ?? 'Dealer'} />

            <div className="mx-auto max-w-3xl space-y-6 p-4">
                <OutstandingBalanceCard
                    balance={data?.total_outstanding_balance ?? 0}
                    description="Sum of unpaid amounts across all dealer orders"
                />

                {/* Dealer Details */}
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Dealer Details
                    </h3>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Name</dt>
                            <dd className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">{data?.name ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Email</dt>
                            <dd className="mt-0.5 text-gray-700 dark:text-gray-300">{data?.email ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Phone</dt>
                            <dd className="mt-0.5 text-gray-700 dark:text-gray-300">{data?.phone ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Status</dt>
                            <dd className="mt-0.5 capitalize text-gray-700 dark:text-gray-300">{data?.application_status ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Registered</dt>
                            <dd className="mt-0.5 text-gray-700 dark:text-gray-300">{data?.created_at ?? '—'}</dd>
                        </div>
                    </dl>
                </div>

                <div className="flex gap-3">
                    <a
                        href={route('distributor.dealer-orders.index')}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        View all dealer orders →
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
