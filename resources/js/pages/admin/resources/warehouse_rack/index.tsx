import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import TextLink from '@/components/text-link';
import ButtonCreate from '@/components/ui/button-create';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Management',
        href: route('admin.stock.dashboard.index'),
    },
    {
        title: 'Warehouses',
        href: route('admin.stock.warehouses.index'),
    },
    {
        title: 'Racks',
        href: '#',
    },
];

export default function RackIndex() {
    const data = (usePage<SharedData>().props as any)?.racks as any;
    const warehouse = (usePage<SharedData>().props as any)?.warehouse as any;
    const items = data?.data || [];

    const handleDelete = (id: number, identifier: string) => {
        if (confirm(`Are you sure you want to delete rack "${identifier}"?`)) {
            router.delete(route('admin.stock.racks.destroy', id));
        }
    };

    const thead = [
        { title: 'Identifier', className: 'p-3' },
        { title: 'Description', className: 'p-3' },
        { title: 'Stock Records', className: 'p-3' },
        { title: 'Actions', className: 'p-3 text-right' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Racks - ${warehouse?.name}`} />

            <div className="mb-4 rounded-lg bg-white p-4 shadow">
                <h2 className="text-xl font-semibold">{warehouse?.name}</h2>
                <p className="text-sm text-gray-600">{warehouse?.address}</p>
            </div>

            <ButtonCreate
                href={route(
                    'admin.stock.warehouses.racks.create',
                    warehouse?.id,
                )}
                text="Add Rack"
            />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((rack: any) => (
                            <tr
                                key={rack.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3 font-medium">
                                    {rack.identifier}
                                </td>
                                <td className="p-3">
                                    {rack.description || '-'}
                                </td>
                                <td className="p-3">
                                    {rack.stock_records_count || 0}
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <TextLink
                                            href={route(
                                                'admin.stock.racks.edit',
                                                rack.id,
                                            )}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </TextLink>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    rack.id,
                                                    rack.identifier,
                                                )
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                {items.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        No racks found. Create your first rack to get started.
                    </div>
                )}
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
