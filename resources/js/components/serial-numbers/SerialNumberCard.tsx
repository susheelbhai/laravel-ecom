import Swal from 'sweetalert2';
import { type SerialNumberData } from './types';
import StatusBadge from './StatusBadge';

interface Props {
    serialNumber: SerialNumberData;
    onMarkStolen: () => void;
    onMarkDamaged: () => void;
    processing: boolean;
}

function getCSSVariable(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function SerialNumberCard({ serialNumber, onMarkStolen, onMarkDamaged, processing }: Props) {
    const isTerminal = serialNumber.status === 'stolen' || serialNumber.status === 'damaged';

    function confirmMarkStolen() {
        Swal.fire({
            title: 'Mark as Stolen?',
            text: `This will flag serial number ${serialNumber.serial_number} as stolen. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: getCSSVariable('--destructive') || '#dc2626',
            cancelButtonColor: getCSSVariable('--muted-foreground') || '#64748b',
            confirmButtonText: 'Yes, mark as stolen',
        }).then((result) => {
            if (result.isConfirmed) {
                onMarkStolen();
            }
        });
    }

    function confirmMarkDamaged() {
        Swal.fire({
            title: 'Mark as Damaged?',
            text: `This will flag serial number ${serialNumber.serial_number} as damaged. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: getCSSVariable('--destructive') || '#dc2626',
            cancelButtonColor: getCSSVariable('--muted-foreground') || '#64748b',
            confirmButtonText: 'Yes, mark as damaged',
        }).then((result) => {
            if (result.isConfirmed) {
                onMarkDamaged();
            }
        });
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="font-mono text-lg font-semibold text-foreground">
                        {serialNumber.serial_number}
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {serialNumber.product?.title ?? '—'}
                        {serialNumber.product?.sku ? ` · SKU: ${serialNumber.product.sku}` : ''}
                    </p>
                </div>
                <StatusBadge status={serialNumber.status} />
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                    <dt className="font-medium text-muted-foreground">Product</dt>
                    <dd className="mt-0.5 text-foreground">{serialNumber.product?.title ?? '—'}</dd>
                </div>
                <div>
                    <dt className="font-medium text-muted-foreground">Current Location</dt>
                    <dd className="mt-0.5 text-foreground">
                        {serialNumber.current_location}
                        {serialNumber.rack && (
                            <span className="ml-1 text-muted-foreground">
                                — {serialNumber.rack.identifier}
                                {serialNumber.rack.warehouse ? ` (${serialNumber.rack.warehouse.name})` : ''}
                            </span>
                        )}
                    </dd>
                </div>
            </dl>

            {!isTerminal && (serialNumber.can_mark_stolen || serialNumber.can_mark_damaged) && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                    {serialNumber.can_mark_stolen && (
                        <button
                            type="button"
                            disabled={processing}
                            onClick={confirmMarkStolen}
                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none disabled:opacity-50"
                        >
                            Mark as Stolen
                        </button>
                    )}
                    {serialNumber.can_mark_damaged && (
                        <button
                            type="button"
                            disabled={processing}
                            onClick={confirmMarkDamaged}
                            className="inline-flex items-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none disabled:opacity-50"
                        >
                            Mark as Damaged
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
