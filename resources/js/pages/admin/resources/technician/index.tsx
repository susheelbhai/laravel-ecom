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
        title: 'Technicians',
        href: '/admin/technician',
    },
];

const getCSSVariable = (variable: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

export default function TechnicianIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];
    const thead = [
        { title: 'ID', className: 'p-3' },
        { title: 'Name', className: 'p-3' },
        { title: 'Email', className: 'p-3' },
        { title: 'Phone', className: 'p-3' },
        { title: 'Specialization', className: 'p-3' },
        { title: 'Experience', className: 'p-3' },
        { title: 'Location', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Registered', className: 'p-3' },
        { title: 'Actions', className: 'p-3' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Technician applications" />

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
                                    {row.specialization
                                        ? row.specialization.replace(/_/g, ' ')
                                        : '—'}
                                </td>
                                <td className="p-3">
                                    {row.experience_years != null
                                        ? `${row.experience_years} yr${row.experience_years !== 1 ? 's' : ''}`
                                        : '—'}
                                </td>
                                <td className="p-3 text-sm">
                                    {[row.city, row.state]
                                        .filter(Boolean)
                                        .join(', ') || '—'}
                                </td>
                                <td className="p-3 capitalize">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            row.application_status === 'approved'
                                                ? 'bg-green-100 text-green-700'
                                                : row.application_status === 'rejected'
                                                  ? 'bg-red-100 text-red-700'
                                                  : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                    >
                                        {row.application_status}
                                    </span>
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
                                                        title: 'Approve this technician?',
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
                                                                    'admin.technician.approve',
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
                                                        title: 'Reject this technician?',
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
                                                                    'admin.technician.reject',
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
                                    {row.application_status === 'rejected' &&
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
