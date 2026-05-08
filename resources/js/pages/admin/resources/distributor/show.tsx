import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/admin/app-layout';
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

function Field({ label, value, mono, full }: { label: string; value?: string | number | null; mono?: boolean; full?: boolean }) {
    if (!value && value !== 0) return null;
    return (
        <div className={full ? 'sm:col-span-2 lg:col-span-3' : ''}>
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

export default function AdminDistributorShow() {
    const { data } = usePage<SharedData>().props as any;
    const [rejectNote, setRejectNote] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Distributors', href: route('admin.distributor.index') },
        { title: data?.name ?? 'Distributor', href: '#' },
    ];

    const status = data?.application_status ?? 'pending';
    const isPending = status === 'pending';

    function handleApprove() {
        router.patch(route('admin.distributor.approve', data.id));
    }

    function handleReject() {
        router.patch(route('admin.distributor.reject', data.id), { rejection_note: rejectNote });
        setShowRejectForm(false);
    }

    const purchaseBandLabels: Record<string, string> = {
        under_1l: 'Under ₹1 lakh',
        '1l_5l': '₹1 lakh – ₹5 lakh',
        '5l_25l': '₹5 lakh – ₹25 lakh',
        '25l_1cr': '₹25 lakh – ₹1 crore',
        above_1cr: 'Above ₹1 crore',
    };

    const constitutionLabels: Record<string, string> = {
        sole_proprietorship: 'Sole Proprietorship',
        partnership: 'Partnership',
        llp: 'LLP',
        private_limited: 'Private Limited',
        public_limited: 'Public Limited',
        opc: 'One Person Company (OPC)',
        trust_society: 'Trust / Society',
        other: 'Other',
    };

    const kycLabels: Record<string, string> = {
        passport: 'Passport',
        national_id: 'National ID',
        aadhaar: 'Aadhaar',
        voter_id: 'Voter ID',
        drivers_license: "Driver's License",
        other: 'Other',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data?.name ?? 'Distributor'} />

            <div className="space-y-6 p-4">

                {/* ── Header ── */}
                <div className="flex flex-wrap items-start justify-between gap-4">
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
                            {data?.legal_business_name && (
                                <p className="text-sm text-muted-foreground">{data.legal_business_name}</p>
                            )}
                            <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${statusStyles[status] ?? statusStyles.pending}`}>
                                {status}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    {isPending && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleApprove}
                                className="rounded-button bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => setShowRejectForm(!showRejectForm)}
                                className="rounded-button border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>

                {/* Reject form */}
                {showRejectForm && (
                    <div className="rounded-div border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30">
                        <p className="mb-2 text-sm font-medium text-rose-800 dark:text-rose-300">Rejection reason (optional)</p>
                        <textarea
                            className="w-full rounded-div border border-rose-300 bg-white px-3 py-2 text-sm dark:border-rose-700 dark:bg-gray-900"
                            rows={3}
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder="Provide a reason for the distributor…"
                        />
                        <div className="mt-2 flex gap-2">
                            <button onClick={handleReject} className="rounded-button bg-rose-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-700">
                                Confirm rejection
                            </button>
                            <button onClick={() => setShowRejectForm(false)} className="rounded-button border border-border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Rejection note */}
                {status === 'rejected' && data?.rejection_note && (
                    <div className="rounded-div border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
                        <span className="font-medium">Rejection reason:</span> {data.rejection_note}
                    </div>
                )}

                {/* Outstanding balance */}
                <OutstandingBalanceCard
                    balance={data?.total_outstanding_balance ?? 0}
                    description="Sum of unpaid amounts across all approved distributor orders"
                />

                {/* ── Contact & identity ── */}
                <Section title="Contact & identity">
                    <Field label="Email" value={data?.email} />
                    <Field label="Phone" value={data?.phone} />
                    <Field label="Date of birth" value={data?.dob} />
                </Section>

                {/* ── Business details ── */}
                <Section title="Business details">
                    <Field label="Legal business name" value={data?.legal_business_name} />
                    <Field label="Trade / shop name" value={data?.trade_name} />
                    <Field label="Constitution" value={constitutionLabels[data?.business_constitution] ?? data?.business_constitution} />
                    <Field label="Signatory designation" value={data?.authorized_signatory_designation} />
                    <Field label="Years in business" value={data?.years_in_business} />
                    <Field label="Expected monthly purchase" value={purchaseBandLabels[data?.expected_monthly_purchase_band] ?? data?.expected_monthly_purchase_band} />
                    <Field label="Referral source" value={data?.referral_source} />
                    <Field label="Nature of business" value={data?.nature_of_business} full />
                </Section>

                {/* ── Address ── */}
                <Section title="Address">
                    <Field label="Street address" value={data?.address} full />
                    <Field label="City" value={data?.city} />
                    <Field label="State" value={data?.state} />
                    <Field label="PIN code" value={data?.pincode} />
                    <Field label="Warehouse / branch address" value={data?.warehouse_address} full />
                </Section>

                {/* ── KYC ── */}
                <Section title="KYC — authorized person">
                    <Field label="ID type" value={kycLabels[data?.kyc_id_type] ?? data?.kyc_id_type} />
                    <Field label="ID number" value={data?.kyc_id_number} mono />
                </Section>

                {/* ── Tax & compliance ── */}
                <Section title="Tax & compliance">
                    <Field label="PAN" value={data?.pan_number} mono />
                    <Field label="GSTIN" value={data?.gstin} mono />
                    <Field label="TAN" value={data?.tan_number} mono />
                    <Field label="MSME Udyam" value={data?.msme_udyam_number} mono />
                </Section>

                {/* ── Bank details ── */}
                <Section title="Bank details">
                    <Field label="Account holder" value={data?.bank_account_holder_name} />
                    <Field label="Bank name" value={data?.bank_name} />
                    <Field label="Branch" value={data?.bank_branch} />
                    <Field label="Account number" value={data?.bank_account_number} mono />
                    <Field label="IFSC" value={data?.bank_ifsc} mono />
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
                        href={route('admin.distributor-orders.index') + `?distributor_id=${data?.id}`}
                        className="text-primary hover:underline"
                    >
                        View all orders →
                    </a>
                    <a
                        href={route('admin.stock.distributors.show', data?.id)}
                        className="text-primary hover:underline"
                    >
                        View stock →
                    </a>
                </div>

            </div>
        </AppLayout>
    );
}
