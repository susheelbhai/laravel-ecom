import { useForm } from '@inertiajs/react';
import { useFormatMoney } from '@/hooks/use-format-money';
import PaymentStatusBadge from '@/components/payment/PaymentStatusBadge';

export interface PaymentHistoryEntry {
    id: number;
    amount: number;
    payment_method: string;
    note: string | null;
    recorded_by_name: string;
    created_at: string;
    payment_proof_url: string | null;
}

export interface PaymentSummary {
    payment_status: 'unpaid' | 'partial' | 'paid';
    amount_paid: number;
    remaining_balance: number;
    payments: PaymentHistoryEntry[];
}

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'upi', label: 'UPI' },
    { value: 'other', label: 'Other' },
];

interface Props {
    summary: PaymentSummary;
    /** Route name for the payment store endpoint */
    storeRoute: string;
    /** Route params for the store route (e.g. order id) */
    storeRouteParams: Record<string, number | string>;
    /** Whether to show the "Add Payment" form (admin/distributor only) */
    canAddPayment?: boolean;
}

export default function PaymentSummarySection({
    summary,
    storeRoute,
    storeRouteParams,
    canAddPayment = false,
}: Props) {
    const { formatMoney } = useFormatMoney();

    const form = useForm({
        amount: '',
        payment_method: '',
        note: '',
        payment_proof: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route(storeRoute, storeRouteParams), {
            forceFormData: true,
            onSuccess: () => form.reset(),
        });
    };

    const showAddPayment = canAddPayment && summary.payment_status !== 'paid';

    return (
        <div className="space-y-6">
            {/* Payment Summary Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Payment Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                        <div className="mt-1">
                            <PaymentStatusBadge status={summary.payment_status} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount Paid</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                            {formatMoney(summary.amount_paid)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Remaining Balance</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                            {formatMoney(summary.remaining_balance)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Payment Form (shown only when partial and canAddPayment) */}
            {showAddPayment && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-700 dark:bg-blue-900/20">
                    <h3 className="mb-4 text-sm font-semibold text-blue-800 dark:text-blue-300">
                        Record Payment
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={summary.remaining_balance}
                                    value={form.data.amount}
                                    onChange={(e) => form.setData('amount', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                    placeholder={`Max: ${formatMoney(summary.remaining_balance)}`}
                                />
                                {form.errors.amount && (
                                    <p className="mt-1 text-xs text-red-600">{form.errors.amount}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payment Method <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.data.payment_method}
                                    onChange={(e) => form.setData('payment_method', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                >
                                    <option value="">Select method…</option>
                                    {PAYMENT_METHODS.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.payment_method && (
                                    <p className="mt-1 text-xs text-red-600">{form.errors.payment_method}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Note
                            </label>
                            <textarea
                                value={form.data.note}
                                onChange={(e) => form.setData('note', e.target.value)}
                                rows={2}
                                maxLength={2000}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                placeholder="Optional note…"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Payment Proof (JPEG, PNG, PDF — max 5 MB)
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) =>
                                    form.setData('payment_proof', e.target.files?.[0] ?? null)
                                }
                                className="w-full text-sm text-gray-700 dark:text-gray-300"
                            />
                            {form.errors.payment_proof && (
                                <p className="mt-1 text-xs text-red-600">{form.errors.payment_proof}</p>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                            >
                                {form.processing ? 'Recording…' : 'Record Payment'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Payment History Table */}
            {summary.payments.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b border-gray-200 px-5 py-3 dark:border-gray-700">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Payment History
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                    <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-300">Amount</th>
                                    <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-300">Method</th>
                                    <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-300">Note</th>
                                    <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-300">Recorded By</th>
                                    <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-300">Date</th>
                                    <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-300">Proof</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <td className="p-3 font-medium tabular-nums text-gray-900 dark:text-gray-100">
                                            {formatMoney(payment.amount)}
                                        </td>
                                        <td className="p-3 capitalize text-gray-700 dark:text-gray-300">
                                            {payment.payment_method.replace(/_/g, ' ')}
                                        </td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">
                                            {payment.note ?? '—'}
                                        </td>
                                        <td className="p-3 text-gray-700 dark:text-gray-300">
                                            {payment.recorded_by_name}
                                        </td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">
                                            {payment.created_at}
                                        </td>
                                        <td className="p-3">
                                            {payment.payment_proof_url ? (
                                                <a
                                                    href={payment.payment_proof_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
