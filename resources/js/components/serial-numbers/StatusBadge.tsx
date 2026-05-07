import { type SerialNumberData } from './types';

const styles: Record<SerialNumberData['status'], string> = {
    available: 'bg-green-100 text-green-800 border-green-200',
    sold: 'bg-blue-100 text-blue-800 border-blue-200',
    stolen: 'bg-red-100 text-red-800 border-red-200',
    damaged: 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function StatusBadge({ status }: { status: SerialNumberData['status'] }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}
        >
            {status}
        </span>
    );
}
