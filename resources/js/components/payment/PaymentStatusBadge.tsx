const PAYMENT_STATUS_STYLES: Record<string, string> = {
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    partial: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    unpaid: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
};

interface Props {
    status: string;
}

export default function PaymentStatusBadge({ status }: Props) {
    const key = (status ?? 'unpaid').toLowerCase();
    const className =
        PAYMENT_STATUS_STYLES[key] ??
        'bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-200 dark:ring-gray-500/30';

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${className}`}
        >
            {key}
        </span>
    );
}
