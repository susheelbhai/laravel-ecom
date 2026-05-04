import { Head, usePage } from '@inertiajs/react';
import ButtonCreate from '@/components/ui/button/button-create';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/distributor/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dealers',
        href: '/distributor/dealer',
    },
];

export default function DealerIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];
    const thead = [
        { title: 'ID', className: 'p-3' },
        { title: 'Name', className: 'p-3' },
        { title: 'Email', className: 'p-3' },
        { title: 'Phone', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Created', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dealers" />
            <ButtonCreate
                href={route('distributor.dealer.create')}
                text="Add dealer"
            />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((row: any) => (
                            <tr
                                key={row.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3">{row.id}</td>
                                <td className="p-3">{row.name}</td>
                                <td className="p-3">{row.email}</td>
                                <td className="p-3">{row.phone ?? '—'}</td>
                                <td className="p-3 capitalize">
                                    {row.application_status}
                                </td>
                                <td className="p-3">{row.created_at}</td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
