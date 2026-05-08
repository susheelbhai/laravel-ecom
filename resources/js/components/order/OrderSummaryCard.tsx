import OrderStatusBadge from './OrderStatusBadge';

interface Props {
    orderNumber: string;
    status: string;
    /** Detail items rendered in the grid below the title — use <OrderDetailItem> */
    children?: React.ReactNode;
    /** Action buttons rendered top-right (e.g. Approve / Reject) */
    actions?: React.ReactNode;
    /** Shown as a rose alert when present */
    rejectionNote?: string | null;
    /** Any extra alert/notice shown below the details grid */
    notice?: React.ReactNode;
}

export default function OrderSummaryCard({
    orderNumber,
    status,
    children,
    actions,
    rejectionNote,
    notice,
}: Props) {
    return (
        <div className="mb-6 rounded-div border border-border bg-card p-6 shadow-sm">
            {/* Title row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">{orderNumber}</h1>
                    <div className="mt-1.5">
                        <OrderStatusBadge status={status} />
                    </div>
                </div>
                {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
            </div>

            {/* Details grid */}
            {children && (
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5 sm:grid-cols-3 lg:grid-cols-4">
                    {children}
                </dl>
            )}

            {/* Rejection note */}
            {rejectionNote && (
                <div className="mt-4 rounded-div border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <span className="font-medium">Rejection reason:</span> {rejectionNote}
                </div>
            )}

            {/* Extra notice */}
            {notice && <div className="mt-4">{notice}</div>}
        </div>
    );
}
