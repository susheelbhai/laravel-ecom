import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import CopyButton from './CopyButton';

interface Serial {
    id: number;
    serial_number: string;
    status: 'damaged' | 'stolen';
    product: { id: number; title: string; sku: string | null } | null;
    movements: { event_type: string; occurred_at: string; notes: string | null }[];
}

interface Props {
    serials: {
        data: Serial[];
        [key: string]: any;
    };
    lookupRoute: string;
}

const STATUS_STYLES = {
    damaged: 'bg-orange-100 text-orange-800',
    stolen: 'bg-red-100 text-red-800',
};

const thead = [
    { title: 'Serial Number', className: 'p-3' },
    { title: 'Product', className: 'p-3' },
    { title: 'Status', className: 'p-3' },
    { title: 'Last Event', className: 'p-3' },
    { title: 'Notes', className: 'p-3' },
];

export default function SerialStatusList({ serials, lookupRoute }: Props) {
    const items: Serial[] = serials?.data ?? [];

    return (
        <TableCard>
            <Table>
                <THead data={thead} />
                <TBody>
                    {items.map((serial) => {
                        const lastMovement = serial.movements?.[0];
                        return (
                            <tr key={serial.id} className="border-t border-gray-200">
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        <a
                                            href={`${lookupRoute}?q=${encodeURIComponent(serial.serial_number)}`}
                                            className="font-mono text-sm text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {serial.serial_number}
                                        </a>
                                        <CopyButton text={serial.serial_number} />
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="font-medium">{serial.product?.title ?? '—'}</div>
                                    {serial.product?.sku && (
                                        <div className="text-xs text-gray-500">{serial.product.sku}</div>
                                    )}
                                </td>
                                <td className="p-3">
                                    <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${STATUS_STYLES[serial.status]}`}>
                                        {serial.status}
                                    </span>
                                </td>
                                <td className="p-3 text-sm text-gray-600">
                                    {lastMovement?.occurred_at ?? '—'}
                                </td>
                                <td className="p-3 text-sm text-gray-500 italic">
                                    {lastMovement?.notes ?? '—'}
                                </td>
                            </tr>
                        );
                    })}
                </TBody>
            </Table>
            {items.length === 0 && (
                <div className="py-12 text-center text-gray-500">No records found.</div>
            )}
            <Pagination data={serials} />
        </TableCard>
    );
}
