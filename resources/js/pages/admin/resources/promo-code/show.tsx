import { Head, usePage } from '@inertiajs/react';
import EditRow from '@/components/table/edit-row';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Promo Codes',
        href: '/admin/promo-code',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

export default function Show() {
    const { data } = usePage().props as any;
    const promoCode = data || {};

    const thead = [
        { title: 'Promo Code Detail', className: 'p-3' },
        { title: '', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Promo Code Detail" />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Code</td>
                            <td className="p-3 text-lg font-bold">
                                {promoCode.code}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Description</td>
                            <td className="p-3">
                                {promoCode.description || '-'}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Discount Type</td>
                            <td className="p-3 capitalize">
                                {promoCode.discount_type}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">
                                Discount Value
                            </td>
                            <td className="p-3">
                                {promoCode.discount_type === 'percentage'
                                    ? `${promoCode.discount_value}%`
                                    : `₹${promoCode.discount_value}`}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">
                                Minimum Order Amount
                            </td>
                            <td className="p-3">
                                {promoCode.min_order_amount
                                    ? `₹${promoCode.min_order_amount}`
                                    : 'No minimum'}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">
                                Maximum Discount Amount
                            </td>
                            <td className="p-3">
                                {promoCode.max_discount_amount
                                    ? `₹${promoCode.max_discount_amount}`
                                    : 'No limit'}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Usage</td>
                            <td className="p-3">
                                {promoCode.usage_count}
                                {promoCode.usage_limit
                                    ? ` / ${promoCode.usage_limit}`
                                    : ' (unlimited)'}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">
                                Per User Limit
                            </td>
                            <td className="p-3">
                                {promoCode.per_user_limit || 'Unlimited'}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Partner</td>
                            <td className="p-3">
                                {promoCode.partner ? (
                                    <div>
                                        <div className="font-semibold">
                                            {promoCode.partner.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {promoCode.partner.email}
                                        </div>
                                    </div>
                                ) : (
                                    'No partner associated'
                                )}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Status</td>
                            <td className="p-3">
                                <span
                                    className={`rounded px-2 py-1 text-xs ${promoCode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                >
                                    {promoCode.is_active
                                        ? 'Active'
                                        : 'Inactive'}
                                </span>
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Valid From</td>
                            <td className="p-3">
                                {promoCode.valid_from
                                    ? new Date(
                                          promoCode.valid_from,
                                      ).toLocaleString()
                                    : 'No start date'}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Valid Until</td>
                            <td className="p-3">
                                {promoCode.valid_until
                                    ? new Date(
                                          promoCode.valid_until,
                                      ).toLocaleString()
                                    : 'No expiry'}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Total Orders</td>
                            <td className="p-3 text-lg font-semibold text-blue-600">
                                {promoCode.total_orders || 0}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">
                                Total Discount Given
                            </td>
                            <td className="p-3 text-lg font-semibold text-green-600">
                                ₹{promoCode.total_discount_given || 0}
                            </td>
                        </tr>
                        <EditRow
                            href={route('admin.promo-code.edit', promoCode.id)}
                            buttonName="Edit Promo Code"
                        />
                    </TBody>
                </Table>
            </TableCard>
        </AppLayout>
    );
}
