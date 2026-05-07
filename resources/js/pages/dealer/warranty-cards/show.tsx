import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/dealer/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

export default function DealerWarrantyCardShow() {
    const { data } = usePage<SharedData>().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Warranty Cards', href: route('dealer.warranty-cards.index') },
        { title: data?.card_number ?? 'Card', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Warranty Card — ${data?.card_number}`} />

            <div className="mx-auto max-w-2xl space-y-6 p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Warranty Card</p>
                        <h1 className="mt-0.5 font-mono text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                            {data?.card_number}
                        </h1>
                    </div>
                    {data?.is_expired ? (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">
                            Expired
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                            Active
                        </span>
                    )}
                </div>

                {/* Printable warranty card */}
                <div
                    id="warranty-card-print"
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950 print:border-gray-300 print:shadow-none"
                >
                    {/* Card header */}
                    <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                    Warranty Certificate
                                </p>
                                <p className="mt-1 font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {data?.card_number}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Issued by</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {data?.dealer_name ?? '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product & serial */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Product</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                                {data?.product_title ?? '—'}
                            </p>
                            {data?.product_sku && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SKU: {data.product_sku}
                                </p>
                            )}
                        </div>

                        {data?.serial_number && (
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Serial Number
                                </p>
                                <p className="mt-0.5 font-mono font-medium text-gray-900 dark:text-gray-100">
                                    {data.serial_number}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Purchase Date</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                                {data?.purchase_date ?? '—'}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Warranty Valid Until
                            </p>
                            <p
                                className={[
                                    'mt-0.5 font-semibold',
                                    data?.is_expired
                                        ? 'text-rose-600 dark:text-rose-400'
                                        : 'text-emerald-700 dark:text-emerald-400',
                                ].join(' ')}
                            >
                                {data?.warranty_expires_at ?? '—'}
                            </p>
                        </div>
                    </div>

                    {/* Customer */}
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Customer
                        </p>
                        <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {data?.customer_name ?? '—'}
                                </p>
                                {data?.customer_phone && (
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {data.customer_phone}
                                    </p>
                                )}
                                {data?.customer_email && (
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {data.customer_email}
                                    </p>
                                )}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                                {[
                                    data?.billing_address_line1,
                                    data?.billing_address_line2,
                                    [data?.billing_city, data?.billing_state, data?.billing_pincode]
                                        .filter(Boolean)
                                        .join(', '),
                                    data?.billing_country,
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    {data?.terms_snapshot && (
                        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                Terms &amp; Conditions
                            </p>
                            <p className="mt-2 whitespace-pre-line text-xs text-gray-600 dark:text-gray-300">
                                {data.terms_snapshot}
                            </p>
                        </div>
                    )}

                    {/* Sale reference */}
                    <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Sale reference:{' '}
                            <span className="font-mono">{data?.sale_number ?? '—'}</span>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
                    >
                        Print / Save as PDF
                    </button>
                    <Link
                        href={route('dealer.warranty-cards.index')}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Back to list
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
