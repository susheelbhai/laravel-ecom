import { Head, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import Pagination from '@/components/table/pagination';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import TextLink from '@/components/ui/button/text-link';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/admin/order' },
];

type Order = {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_method: string;
    payment_status: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    items_count: number;
};

export default function Index() {
    const data = (usePage<SharedData>().props as any)?.data as any;
    const items = data?.data || [];

    const thead = [
        { title: 'Order #', className: 'p-3' },
        { title: 'Customer', className: 'p-3' },
        { title: 'Items', className: 'p-3' },
        { title: 'Amount', className: 'p-3' },
        { title: 'Status', className: 'p-3' },
        { title: 'Payment', className: 'p-3' },
        { title: 'Date', className: 'p-3' },
        { title: 'View', className: 'p-3' },
    ];

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            pending: 'bg-muted text-muted-foreground',
            processing: 'bg-primary/20 text-primary',
            completed: 'bg-accent/20 text-accent',
            cancelled: 'bg-destructive/20 text-destructive',
        };
        return colors[status] || 'bg-muted text-muted-foreground';
    };

    const getPaymentStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            pending: 'bg-secondary/20 text-secondary',
            paid: 'bg-accent/20 text-accent',
            failed: 'bg-destructive/20 text-destructive',
        };
        return colors[status] || 'bg-muted text-muted-foreground';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        {items.map((order: Order) => (
                            <tr
                                key={order.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3 font-semibold">
                                    {order.order_number}
                                </td>
                                <td className="p-3">
                                    <div>
                                        <div className="font-medium">
                                            {order.user.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {order.user.email}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3">{order.items_count}</td>
                                <td className="p-3 font-semibold">
                                    {formatMoney(order.total_amount)}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                                            order.status,
                                        )}`}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusColor(
                                            order.payment_status,
                                        )}`}
                                    >
                                        {order.payment_status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3 text-sm">
                                    {formatDate(order.created_at)}
                                </td>
                                <td className="p-3">
                                    <TextLink
                                        href={route(
                                            'admin.order.show',
                                            order.id,
                                        )}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </TextLink>
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
                <Pagination data={data} />
            </TableCard>
        </AppLayout>
    );
}
