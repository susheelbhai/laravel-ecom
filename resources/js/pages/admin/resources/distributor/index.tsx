import { Head, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import Button from '@/components/ui/button/button';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Distributors',
        href: '/admin/distributor',
    },
];

const getCSSVariable = (variable: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

export default function DistributorIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];
    const thead = [
        { title: 'ID', className: 'p-3' },
        { title: 'Signatory', className: 'p-3' },
        { title: 'Legal name', className: 'p-3' },
        { title: 'GSTIN', className: 'p-3' },
        { title: 'Email', className: 'p-3' },
        { title: 'Phone', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Registered', className: 'p-3' },
        { title: 'Actions', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Distributor applications" />

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
                                <td className="line-clamp-2 max-w-[10rem] p-3 text-sm">
                                    {row.legal_business_name ?? '—'}
                                </td>
                                <td className="p-3 font-mono text-xs">
                                    {row.gstin ?? '—'}
                                </td>
                                <td className="p-3">{row.email}</td>
                                <td className="p-3">{row.phone ?? '—'}</td>
                                <td className="p-3 capitalize">
                                    {row.application_status}
                                </td>
                                <td className="p-3">{row.created_at}</td>
                                <td className="space-x-2 p-3">
                                    {row.application_status === 'pending' && (
                                        <>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: 'Approve this distributor?',
                                                        text: `This will allow ${row.name} to access their dashboard.`,
                                                        icon: 'question',
                                                        showCancelButton: true,
                                                        confirmButtonColor:
                                                            getCSSVariable(
                                                                '--primary',
                                                            ) || '#2563eb',
                                                        cancelButtonColor:
                                                            getCSSVariable(
                                                                '--muted-foreground',
                                                            ) || '#64748b',
                                                        confirmButtonText:
                                                            'Yes, approve',
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            router.patch(
                                                                route(
                                                                    'admin.distributor.approve',
                                                                    row.id,
                                                                ),
                                                                {},
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }
                                                    });
                                                }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: 'Reject this distributor?',
                                                        text: 'They will not be able to sign in until the application is approved.',
                                                        input: 'textarea',
                                                        inputPlaceholder:
                                                            'Optional note for the applicant (internal)',
                                                        showCancelButton: true,
                                                        confirmButtonColor:
                                                            getCSSVariable(
                                                                '--destructive',
                                                            ) || '#dc2626',
                                                        cancelButtonColor:
                                                            getCSSVariable(
                                                                '--muted-foreground',
                                                            ) || '#64748b',
                                                        confirmButtonText:
                                                            'Reject',
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            router.patch(
                                                                route(
                                                                    'admin.distributor.reject',
                                                                    row.id,
                                                                ),
                                                                {
                                                                    rejection_note:
                                                                        typeof result.value ===
                                                                        'string'
                                                                            ? result.value
                                                                            : '',
                                                                },
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }
                                                    });
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {row.application_status ===
                                        'rejected' &&
                                        row.rejection_note && (
                                            <span className="text-xs text-muted-foreground">
                                                {row.rejection_note}
                                            </span>
                                        )}
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
