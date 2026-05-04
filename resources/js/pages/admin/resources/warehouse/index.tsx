import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Edit, Trash2, Warehouse as WarehouseIcon } from 'lucide-react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import TextLink from '@/components/ui/button/text-link';
import ButtonCreate from '@/components/ui/button/button-create';
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
];

export default function WarehouseIndex() {
    const data = (usePage<SharedData>().props as any)?.warehouses as any;
    const items = data?.data || [];

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete warehouse "${name}"?`)) {
            router.delete(route('admin.stock.warehouses.destroy', id));
        }
    };

    const thead = [
        { title: 'Name', className: 'p-3' },
        { title: 'Address', className: 'p-3' },
        { title: 'Racks', className: 'p-3' },
        { title: 'Actions', className: 'p-3 text-right' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouses" />
            <ButtonCreate
                href={route('admin.stock.warehouses.create')}
                text="Add Warehouse"
            />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((warehouse: any) => (
                            <tr
                                key={warehouse.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3 font-medium">
                                    <TextLink
                                        href={route(
                                            'admin.stock.warehouses.racks.index',
                                            warehouse.id,
                                        )}
                                    >
                                        {warehouse.name}
                                    </TextLink>
                                </td>
                                <td className="p-3">{warehouse.address}</td>
                                <td className="p-3">
                                    <TextLink
                                        href={route(
                                            'admin.stock.warehouses.racks.index',
                                            warehouse.id,
                                        )}
                                    >
                                        {warehouse.racks_count || 0}
                                    </TextLink>
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <TextLink
                                            href={route(
                                                'admin.stock.warehouses.racks.index',
                                                warehouse.id,
                                            )}
                                            title="View Racks"
                                        >
                                            <WarehouseIcon className="h-4 w-4" />
                                        </TextLink>
                                        <TextLink
                                            href={route(
                                                'admin.stock.warehouses.edit',
                                                warehouse.id,
                                            )}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </TextLink>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    warehouse.id,
                                                    warehouse.name,
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
                        No warehouses found. Create your first warehouse to get
                        started.
                    </div>
                )}
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
