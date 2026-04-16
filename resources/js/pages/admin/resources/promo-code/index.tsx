import { Head, usePage } from '@inertiajs/react';
import Button from '@/components/button';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import ButtonCreate from '@/components/ui/button-create';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Promo Codes',
        href: '/admin/promo-code',
    },
];

export default function PromoCodeIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];
    const thead = [
        { title: 'ID', className: 'p-3' },
        { title: 'Code', className: 'p-3' },
        { title: 'Type', className: 'p-3' },
        { title: 'Value', className: 'p-3' },
        { title: 'Usage', className: 'p-3' },
        { title: 'Partner', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Valid Until', className: 'p-3' },
        { title: 'View', className: 'p-3' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Promo Codes" />
            <ButtonCreate
                href={route('admin.promo-code.create')}
                text="Add New Promo Code"
            />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((promoCode: any) => (
                            <tr
                                key={promoCode.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3">{promoCode.id}</td>
                                <td className="p-3 font-semibold">
                                    {promoCode.code}
                                </td>
                                <td className="p-3 capitalize">
                                    {promoCode.discount_type}
                                </td>
                                <td className="p-3">
                                    {promoCode.discount_type === 'percentage'
                                        ? `${promoCode.discount_value}%`
                                        : `₹${promoCode.discount_value}`}
                                </td>
                                <td className="p-3">
                                    {promoCode.usage_count}
                                    {promoCode.usage_limit
                                        ? ` / ${promoCode.usage_limit}`
                                        : ''}
                                </td>
                                <td className="p-3">
                                    {promoCode.partner
                                        ? promoCode.partner.name
                                        : '-'}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`rounded px-2 py-1 text-xs ${promoCode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {promoCode.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {promoCode.valid_until
                                        ? new Date(
                                              promoCode.valid_until,
                                          ).toLocaleDateString()
                                        : 'No expiry'}
                                </td>
                                <td className="p-3">
                                    <Button
                                        href={route(
                                            'admin.promo-code.show',
                                            promoCode.id,
                                        )}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
