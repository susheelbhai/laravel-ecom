interface ScanAlert {
    serial_number: string;
    product_name: string | null;
    scanned_at: string;
}

interface Props {
    alert: ScanAlert;
}

export default function ScanStolenResult({ alert }: Props) {
    const formattedDate = (() => {
        try {
            return new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(alert.scanned_at));
        } catch {
            return alert.scanned_at;
        }
    })();

    return (
        <div
            role="alert"
            aria-live="assertive"
            className="flex flex-col gap-4 rounded-div border-2 border-red-400 bg-red-50 p-6 dark:border-red-700 dark:bg-red-950"
        >
            <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                    <svg
                        className="h-8 w-8 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </span>
                <p className="text-xl font-bold text-red-800 dark:text-red-200">
                    ⚠ Stolen Unit Detected
                </p>
            </div>

            <dl className="grid grid-cols-1 gap-3 rounded-div bg-red-100 p-4 text-sm dark:bg-red-900/50 sm:grid-cols-2">
                <div>
                    <dt className="font-semibold text-red-700 dark:text-red-300">Serial Number</dt>
                    <dd className="mt-0.5 font-mono text-red-900 dark:text-red-100">{alert.serial_number}</dd>
                </div>
                <div>
                    <dt className="font-semibold text-red-700 dark:text-red-300">Product</dt>
                    <dd className="mt-0.5 text-red-900 dark:text-red-100">{alert.product_name ?? '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                    <dt className="font-semibold text-red-700 dark:text-red-300">Scanned At</dt>
                    <dd className="mt-0.5 text-red-900 dark:text-red-100">{formattedDate}</dd>
                </div>
            </dl>

            <p className="text-sm text-red-700 dark:text-red-300">
                Relevant parties have been notified automatically.
            </p>
        </div>
    );
}
