import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/distributor/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import OutstandingBalanceCard from '@/components/ui/outstanding-balance-card';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-div border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {title}
            </h3>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </dl>
        </div>
    );
}

function Field({ label, value, mono }: { label: string; value?: string | number | null; mono?: boolean }) {
    if (!value && value !== 0) return null;
    return (
        <div>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className={`mt-0.5 text-sm font-medium text-foreground ${mono ? 'font-mono' : ''}`}>
                {value}
            </dd>
        </div>
    );
}

const statusStyles: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    pending: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    rejected: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
};

export default function DistributorDealerShow() {
    const { data } = usePage<SharedData>().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dealers', href: route('distributor.dealer.index') },
        { title: data?.name ?? 'Dealer', href: '#' },
    ];

    const status = data?.application_status ?? 'pending';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data?.name ?? 'Dealer'} />

            <div className="space-y-6 p-4">

                {/* ── Header ── */}
                <div className="flex items-center gap-4">
                    {data?.avatar && (
                        <img
                            src={data.avatar}
                            alt={data.name}
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
                        />
                    )}
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">{data?.name}</h1>
                        <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${statusStyles[status] ?? statusStyles.pending}`}>
                            {status}
                        </span>
                    </div>
                </div>

                {/* Rejection note */}
                {status === 'rejected' && data?.rejection_note && (
                    <div className="rounded-div border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
                        <span className="font-medium">Rejection reason:</span> {data.rejection_note}
                    </div>
                )}

                {/* Outstanding balance */}
                <OutstandingBalanceCard
                    balance={data?.total_outstanding_balance ?? 0}
                    description="Sum of unpaid amounts across all dealer orders"
                />

                {/* ── Contact ── */}
                <Section title="Contact">
                    <Field label="Email" value={data?.email} />
                    <Field label="Phone" value={data?.phone} />
                </Section>

                {/* ── Application ── */}
                <Section title="Application">
                    <Field label="Registered on" value={data?.created_at} />
                    <Field label="Approved on" value={data?.approved_at} />
                    <Field label="Approved by" value={data?.approved_by_name} />
                    <Field label="Rejected on" value={data?.rejected_at} />
                    <Field label="Commission %" value={data?.commission_percentage != null ? `${data.commission_percentage}%` : null} />
                </Section>

                {/* ── Actions ── */}
                <div className="flex gap-4 text-sm">
                    <a
                        href={route('distributor.dealer-orders.index')}
                        className="text-primary hover:underline"
                    >
                        View dealer orders →
                    </a>
                    <a
                        href={route('distributor.dealers.stock.show', data?.id)}
                        className="text-primary hover:underline"
                    >
                        View stock →
                    </a>
                </div>

            </div>
        </AppLayout>
    );
}
