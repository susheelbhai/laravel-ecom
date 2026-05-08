import { useFormatMoney } from '@/hooks/use-format-money';

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'upi', label: 'UPI' },
    { value: 'other', label: 'Other' },
];

interface Props {
    /** The form data object from useForm */
    data: Record<string, any>;
    /** The setData function from useForm */
    setData: (key: string, value: any) => void;
    /** The errors object from useForm */
    errors: Record<string, string>;
    /** The computed total amount of the order (for validation hint) */
    totalAmount?: number;
}

export default function PaymentInitialSection({ data, setData, errors, totalAmount }: Props) {
    const { formatMoney } = useFormatMoney();
    const paymentStatus = data.payment_status ?? 'unpaid';
    const showAmountField = paymentStatus === 'partial';
    const showMethodField = paymentStatus === 'partial' || paymentStatus === 'paid';

    return (
        <div className="rounded-div border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Payment
            </h3>

            {/* Payment Status */}
            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Status
                </label>
                <div className="flex gap-4">
                    {(['unpaid', 'partial', 'paid'] as const).map((status) => (
                        <label key={status} className="flex cursor-pointer items-center gap-2 text-sm capitalize">
                            <input
                                type="radio"
                                name="payment_status"
                                value={status}
                                checked={paymentStatus === status}
                                onChange={() => setData('payment_status', status)}
                                className="h-4 w-4 text-blue-600"
                            />
                            {status}
                        </label>
                    ))}
                </div>
                {errors.payment_status && (
                    <p className="mt-1 text-xs text-red-600">{errors.payment_status}</p>
                )}
            </div>

            {/* Amount Paid (partial only) */}
            {showAmountField && (
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount Paid <span className="text-red-500">*</span>
                        {totalAmount !== undefined && (
                            <span className="ml-1 text-xs font-normal text-gray-500">
                                (must be between 0.01 and {formatMoney(totalAmount)})
                            </span>
                        )}
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={totalAmount}
                        value={data.amount_paid ?? ''}
                        onChange={(e) => setData('amount_paid', e.target.value)}
                        className="w-full rounded-div border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        placeholder="0.00"
                    />
                    {errors.amount_paid && (
                        <p className="mt-1 text-xs text-red-600">{errors.amount_paid}</p>
                    )}
                </div>
            )}

            {/* Payment Method */}
            {showMethodField && (
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.payment_method ?? ''}
                        onChange={(e) => setData('payment_method', e.target.value)}
                        className="w-full rounded-div border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select method…</option>
                        {PAYMENT_METHODS.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                    {errors.payment_method && (
                        <p className="mt-1 text-xs text-red-600">{errors.payment_method}</p>
                    )}
                </div>
            )}

            {/* Note */}
            {showMethodField && (
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Note
                    </label>
                    <textarea
                        value={data.note ?? ''}
                        onChange={(e) => setData('note', e.target.value)}
                        rows={2}
                        maxLength={2000}
                        className="w-full rounded-div border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Optional note…"
                    />
                    {errors.note && (
                        <p className="mt-1 text-xs text-red-600">{errors.note}</p>
                    )}
                </div>
            )}

            {/* Payment Proof */}
            {showMethodField && (
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Payment Proof (JPEG, PNG, PDF — max 5 MB)
                    </label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setData('payment_proof', e.target.files?.[0] ?? null)}
                        className="w-full text-sm text-gray-700 dark:text-gray-300"
                    />
                    {errors.payment_proof && (
                        <p className="mt-1 text-xs text-red-600">{errors.payment_proof}</p>
                    )}
                </div>
            )}
        </div>
    );
}
