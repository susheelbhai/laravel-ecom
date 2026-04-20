import { Head, Link, usePage } from '@inertiajs/react';
import ShippingSection from '@/components/shipping/ShippingSection';
import Table from '@/components/table/table';
import TableCard from '@/components/table/table-card';
import TBody from '@/components/table/tbody';
import THead from '@/components/table/thead';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/admin/order' },
    { title: 'Order Detail', href: '#' },
];

type OrderItem = {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        id: number;
        title: string;
        slug: string;
        thumbnail: string;
        image: string;
    };
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
    country: string;
    pincode: string;
    landmark: string | null;
};

type Payment = {
    id: number;
    payment_id: string;
    order_id: string;
    amount: number;
    payment_gateway_id: number;
    payment_status: number;
    created_at: string;
    updated_at: string;
};

type Order = {
    id: number;
    order_number: string;
    subtotal_amount?: number;
    discount_amount?: number;
    total_amount: number;
    promo_code_used?: string;
    promo_code_id?: number;
    status: string;
    payment_method: string;
    payment_status: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    items: OrderItem[];
    address: Address;
    payments: Payment[];
    shipment?: {
        id: number;
        tracking_number: string;
        awb_code: string;
        shipping_provider: string;
        status: string;
        created_at: string;
    };

};

export default function Show() {
    const { order } = usePage<SharedData>().props as any as { order: Order };

    const thead = [
        { title: 'Order Detail', className: 'p-3' },
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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
            <Head title={`Order #${order.order_number}`} />

            <TableCard>
                <Table>
                    <THead data={thead} />
                    <TBody>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Order Number</td>
                            <td className="p-3">{order.order_number}</td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Customer</td>
                            <td className="p-3">
                                <Link
                                    href={route(
                                        'admin.user.show',
                                        order.user.id,
                                    )}
                                >
                                    <div className="cursor-pointer font-medium hover:text-primary">
                                        {order.user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {order.user.email}
                                    </div>
                                </Link>
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Order Date</td>
                            <td className="p-3">
                                {formatDate(order.created_at)}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Order Status</td>
                            <td className="p-3">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                        order.status,
                                    )}`}
                                >
                                    {order.status.toUpperCase()}
                                </span>
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">
                                Payment Method
                            </td>
                            <td className="p-3">
                                {order.payment_method.toUpperCase()}
                            </td>
                        </tr>

                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">
                                Payment Status
                            </td>
                            <td className="p-3">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusColor(
                                        order.payment_status,
                                    )}`}
                                >
                                    {order.payment_status.toUpperCase()}
                                </span>
                            </td>
                        </tr>

                        {order.subtotal_amount && (
                            <tr className="border-y border-gray-200">
                                <td className="p-3 font-semibold">Subtotal</td>
                                <td className="p-3">
                                    {formatMoney(order.subtotal_amount)}
                                </td>
                            </tr>
                        )}

                        {order.promo_code_used && (
                            <>
                                <tr className="border-y border-gray-200">
                                    <td className="p-3 font-semibold">
                                        Promo Code Applied
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <span className="">
                                                {order.promo_code_used}
                                            </span>
                                            {order.promo_code_id && (
                                                <Link
                                                    href={route(
                                                        'admin.promo-code.show',
                                                        order.promo_code_id,
                                                    )}
                                                    className="text-xs text-primary underline hover:text-primary/80"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                <tr className="border-y border-gray-200">
                                    <td className="p-3 font-semibold">
                                        Discount Amount
                                    </td>
                                    <td className="p-3 text-lg font-bold text-green-600">
                                        -{' '}
                                        {formatMoney(
                                            order.discount_amount || 0,
                                        )}
                                    </td>
                                </tr>
                            </>
                        )}

                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Total Amount</td>
                            <td className="p-3 text-lg font-bold text-primary">
                                {formatMoney(order.total_amount)}
                            </td>
                        </tr>
                    </TBody>
                </Table>
            </TableCard>

            {/* Delivery Address */}
            <TableCard className="mt-6">
                <Table>
                    <THead
                        data={[
                            { title: 'Delivery Address', className: 'p-3' },
                            { title: '', className: 'p-3' },
                        ]}
                    />
                    <TBody>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Full Name</td>
                            <td className="p-3">{order.address.full_name}</td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Phone</td>
                            <td className="p-3">{order.address.phone}</td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Address</td>
                            <td className="p-3">
                                {order.address.address_line1}
                                {order.address.address_line2 &&
                                    `, ${order.address.address_line2}`}
                                {order.address.landmark &&
                                    `, ${order.address.landmark}`}
                            </td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">City</td>
                            <td className="p-3">{order.address.city}</td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">State</td>
                            <td className="p-3">{order.address.state}</td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Country</td>
                            <td className="p-3">{order.address.country}</td>
                        </tr>
                        <tr className="border-y border-gray-200">
                            <td className="p-3 font-semibold">Pincode</td>
                            <td className="p-3">{order.address.pincode}</td>
                        </tr>
                    </TBody>
                </Table>
            </TableCard>

            {/* Payment Information */}
            {order.payments && order.payments.length > 0 && (
                <TableCard className="mt-6">
                    <Table>
                        <THead
                            data={[
                                {
                                    title: 'Payment Information',
                                    className: 'p-3',
                                },
                                { title: '', className: 'p-3' },
                            ]}
                        />
                        <TBody>
                            {order.payments.map((payment: Payment) => (
                                <>
                                    <tr
                                        key={`payment-${payment.id}`}
                                        className="border-y border-gray-200"
                                    >
                                        <td className="p-3 font-semibold">
                                            Payment ID
                                        </td>
                                        <td className="p-3 font-mono text-sm">
                                            {payment.payment_id}
                                        </td>
                                    </tr>
                                    <tr className="border-y border-gray-200">
                                        <td className="p-3 font-semibold">
                                            Gateway Order ID
                                        </td>
                                        <td className="p-3 font-mono text-sm">
                                            {payment.order_id}
                                        </td>
                                    </tr>
                                    <tr className="border-y border-gray-200">
                                        <td className="p-3 font-semibold">
                                            Amount Paid
                                        </td>
                                        <td className="p-3 font-semibold text-accent">
                                            {formatMoney(payment.amount)}
                                        </td>
                                    </tr>
                                    <tr className="border-y border-gray-200">
                                        <td className="p-3 font-semibold">
                                            Payment Gateway
                                        </td>
                                        <td className="p-3">
                                            {payment.payment_gateway_id === 2 &&
                                                'Razorpay'}
                                            {payment.payment_gateway_id === 6 &&
                                                'PhonePe'}
                                            {payment.payment_gateway_id === 7 &&
                                                'Cashfree'}
                                            {payment.payment_gateway_id === 8 &&
                                                'PayU'}
                                            {![2, 6, 7, 8].includes(
                                                payment.payment_gateway_id,
                                            ) &&
                                                `Gateway ${payment.payment_gateway_id}`}
                                        </td>
                                    </tr>
                                    <tr className="border-y border-gray-200">
                                        <td className="p-3 font-semibold">
                                            Transaction Status
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    payment.payment_status === 1
                                                        ? 'bg-accent/20 text-accent'
                                                        : 'bg-destructive/20 text-destructive'
                                                }`}
                                            >
                                                {payment.payment_status === 1
                                                    ? 'SUCCESS'
                                                    : 'FAILED'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="border-y border-gray-200">
                                        <td className="p-3 font-semibold">
                                            Payment Date
                                        </td>
                                        <td className="p-3">
                                            {formatDate(payment.created_at)}
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </TBody>
                    </Table>
                </TableCard>
            )}

            {/* Order Items */}
            <TableCard className="mt-6">
                <Table>
                    <THead
                        data={[
                            { title: 'Product', className: 'p-3' },
                            { title: 'Price', className: 'p-3' },
                            { title: 'Quantity', className: 'p-3' },
                            { title: 'Subtotal', className: 'p-3' },
                        ]}
                    />
                    <TBody>
                        {order.items.map((item: OrderItem) => (
                            <tr
                                key={item.id}
                                className="border-t border-gray-200"
                            >
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        {item.product.thumbnail && (
                                            <img
                                                src={item.product.thumbnail}
                                                alt={item.product.title}
                                                className="h-16 w-16 rounded object-cover"
                                            />
                                        )}
                                        <div>
                                            <Link
                                                href={route(
                                                    'admin.product.show',
                                                    item.product.id,
                                                )}
                                                className="font-medium hover:text-primary"
                                            >
                                                {item.product.title}
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3">
                                    {formatMoney(item.price)}
                                </td>
                                <td className="p-3">{item.quantity}</td>
                                <td className="p-3 font-semibold">
                                    {formatMoney(item.subtotal)}
                                </td>
                            </tr>
                        ))}
                    </TBody>
                </Table>
            </TableCard>
            <ShippingSection orderId={order.id} shipment={order.shipment} />
        </AppLayout>
    );
}
