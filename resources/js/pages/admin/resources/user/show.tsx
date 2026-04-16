import { Head, Link, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import Button from '@/components/button';
import EditRow from '@/components/table/edit-row';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import TextLink from '@/components/text-link';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/admin/user',
    },
    {
        title: 'Detail',
        href: '',
    },
];

type Order = {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
    items_count: number;
};

type Address = {
    id: number;
    type: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    pincode: string;
    is_default: number;
};

export default function Dashboard() {
    const {
        data: team,
        orders = [],
        addresses = [],
    } = usePage<SharedData>().props as any as {
        data: {
            id: number;
            name: string;
            email: string;
            phone: string;
            is_active: number;
            profile_pic: string;
        };
        orders: Order[];
        addresses: Address[];
    };
    const thead = [
        { title: 'User Detail', className: 'p-3' },
        { title: '', className: 'p-3' },
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
            <Head title="User Detail" />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        <tr className="border-y border-gray-200">
                            <td className="p-3">Name</td>
                            <td className="p-3">{team.name}</td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3">Email</td>
                            <td className="p-3">{team.email}</td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3">Phone</td>
                            <td className="p-3">{team.phone}</td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3">Image</td>
                            <td className="p-3">
                                <img
                                    src={`${team.profile_pic}`}
                                    alt=""
                                    width={120}
                                />
                            </td>
                        </tr>

                        <EditRow href={route('admin.user.edit', team.id)}>
                            Edit
                        </EditRow>
                    </TBody>
                </Table>
            </TableCard>

            {/* Orders Section */}
            <TableCard className="mt-6">
                <div className="border-b border-gray-200 p-4">
                    <h2 className="text-lg font-semibold">
                        Orders ({orders.length})
                    </h2>
                </div>
                {orders.length > 0 ? (
                    <Table>
                        <THead
                            data={[
                                { title: 'Order #', className: 'p-3' },
                                { title: 'Items', className: 'p-3' },
                                { title: 'Amount', className: 'p-3' },
                                { title: 'Status', className: 'p-3' },
                                { title: 'Payment', className: 'p-3' },
                                { title: 'Date', className: 'p-3' },
                                { title: 'View', className: 'p-3' },
                            ]}
                        />
                        <TBody>
                            {orders.map((order: Order) => (
                                <tr
                                    key={order.id}
                                    className="border-t border-gray-200"
                                >
                                    <td className="p-3 font-semibold">
                                        {order.order_number}
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
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        No orders found for this user.
                    </div>
                )}
            </TableCard>

            {/* Addresses Section */}
            <TableCard className="mt-6">
                <div className="border-b border-gray-200 p-4">
                    <h2 className="text-lg font-semibold">
                        Addresses ({addresses.length})
                    </h2>
                </div>
                {addresses.length > 0 ? (
                    <Table>
                        <THead
                            data={[
                                { title: 'Type', className: 'p-3' },
                                { title: 'Full Name', className: 'p-3' },
                                { title: 'Phone', className: 'p-3' },
                                { title: 'Address', className: 'p-3' },
                                { title: 'City', className: 'p-3' },
                                { title: 'State', className: 'p-3' },
                                { title: 'Pincode', className: 'p-3' },
                                { title: 'Default', className: 'p-3' },
                            ]}
                        />
                        <TBody>
                            {addresses.map((address: Address) => (
                                <tr
                                    key={address.id}
                                    className="border-t border-gray-200"
                                >
                                    <td className="p-3">
                                        <span className="inline-block rounded bg-primary/20 px-2 py-1 text-xs font-semibold text-primary">
                                            {address.type}
                                        </span>
                                    </td>
                                    <td className="p-3">{address.full_name}</td>
                                    <td className="p-3">{address.phone}</td>
                                    <td className="p-3">
                                        {address.address_line1}
                                        {address.address_line2 &&
                                            `, ${address.address_line2}`}
                                    </td>
                                    <td className="p-3">{address.city}</td>
                                    <td className="p-3">{address.state}</td>
                                    <td className="p-3">{address.pincode}</td>
                                    <td className="p-3">
                                        {address.is_default === 1 ? (
                                            <span className="inline-block rounded bg-accent/20 px-2 py-1 text-xs font-semibold text-accent">
                                                Default
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </TBody>
                    </Table>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        No addresses found for this user.
                    </div>
                )}
            </TableCard>
        </AppLayout>
    );
}
