import { Head, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/components/table/pagination';
import Button from '@/components/ui/button/button';
import PersonCard from '@/components/ui/person-card';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Distributors', href: '/admin/distributor' },
];

const getCSSVariable = (variable: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

export default function DistributorIndex() {
    const { data } = usePage<SharedData>().props as any;
    const items = data?.data || [];

    const handleApprove = (row: any) => {
        Swal.fire({
            title: 'Approve this distributor?',
            text: `This will allow ${row.name} to access their dashboard.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: getCSSVariable('--primary') || '#2563eb',
            cancelButtonColor: getCSSVariable('--muted-foreground') || '#64748b',
            confirmButtonText: 'Yes, approve',
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(route('admin.distributor.approve', row.id), {}, { preserveScroll: true });
            }
        });
    };

    const handleReject = (row: any) => {
        Swal.fire({
            title: 'Reject this distributor?',
            text: 'They will not be able to sign in until the application is approved.',
            input: 'textarea',
            inputPlaceholder: 'Optional note for the applicant (internal)',
            showCancelButton: true,
            confirmButtonColor: getCSSVariable('--destructive') || '#dc2626',
            cancelButtonColor: getCSSVariable('--muted-foreground') || '#64748b',
            confirmButtonText: 'Reject',
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(
                    route('admin.distributor.reject', row.id),
                    { rejection_note: typeof result.value === 'string' ? result.value : '' },
                    { preserveScroll: true },
                );
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Distributor applications" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((row: any) => (
                    <PersonCard
                        key={row.id}
                        name={row.name}
                        email={row.email}
                        phone={row.phone}
                        status={row.application_status}
                        date={row.created_at}
                        subtitle={row.legal_business_name}
                        meta={row.gstin}
                        rejectionNote={row.rejection_note}
                        href={route('admin.distributor.show', row.id)}
                        actions={
                            row.application_status === 'pending' ? (
                                <>
                                    <Button type="button" size="sm" onClick={() => handleApprove(row)}>
                                        Approve
                                    </Button>
                                    <Button type="button" size="sm" variant="destructive" onClick={() => handleReject(row)}>
                                        Reject
                                    </Button>
                                </>
                            ) : undefined
                        }
                    />
                ))}
            </div>

            <div className="mt-4">
                <Pagination data={data} />
            </div>
        </AppLayout>
    );
}
