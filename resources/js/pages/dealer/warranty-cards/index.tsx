import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/dealer/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Warranty Cards', href: '/dealer/warranty-cards' },
];

export default function DealerWarrantyCardIndex() {
    const { data } = usePage<SharedData>().props as any;

    const thead = [
        { title: 'Card #', className: 'p-3 sm:p-4' },
        { title: 'Product', className: 'p-3 sm:p-4' },
        { title: 'Serial #', className: 'p-3 sm:p-4' },
        { title: 'Sale #', className: 'p-3 sm:p-4' },
        { title: 'Purchase date', className: 'p-3 sm:p-4' },
        { title: 'Expires', className: 'p-3 sm:p-4' },
        { title: 'Status', className: 'p-3 sm:p-4' },
        { title: '', className: 'p-3 sm:p-4' },
    ];

    const rows = data?.data ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warranty Cards" />

            <div className="w-full space-y-4 p-4">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Warranty Cards
                </h1>

                <TableCard>
                    <Table className="w-full">
                        <THead data={thead} />
                        <TBody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="p-6 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        No warranty cards yet. They are generated automatically when a retail sale is recorded for a product with warranty configured.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((card: any) => (
                                    <tr
                                        key={card.id}
                                        className="border-t border-gray-200 odd:bg-gray-50/60 dark:border-gray-800 dark:odd:bg-gray-900/40"
                                    >
                                        <td className="p-3 font-mono text-xs text-gray-700 dark:text-gray-200 sm:p-4">
                                            {card.card_number}
                                        </td>
                                        <td className="p-3 text-sm text-gray-900 dark:text-gray-100 sm:p-4">
                                            {card.product_title ?? '—'}
                                        </td>
                                        <td className="p-3 font-mono text-xs text-gray-700 dark:text-gray-200 sm:p-4">
                                            {card.serial_number ?? '—'}
                                        </td>
                                        <td className="p-3 text-xs text-gray-600 dark:text-gray-300 sm:p-4">
                                            {card.sale_number ?? '—'}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-200 sm:p-4">
                                            {card.purchase_date}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 dark:text-gray-200 sm:p-4">
                                            {card.warranty_expires_at}
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            {card.is_expired ? (
                                                <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">
                                                    Expired
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            <Link
                                                href={route('dealer.warranty-cards.show', card.id)}
                                                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </TBody>
                    </Table>
                </TableCard>
            </div>
        </AppLayout>
    );
}
