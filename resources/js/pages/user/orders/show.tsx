import { Link, usePage } from '@inertiajs/react';
import { Container } from '@/components/ui/layout/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import AppLayout from '@/layouts/user/app-layout';
import UserShippingSection from '@/components/shipping/UserShippingSection';

interface OrderItem {
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
}

interface Address {
    id: number;
    type: string;
    full_name: string;
    phone: string;
    alternate_phone: string | null;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    country: string;
    pincode: string;
    landmark: string | null;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_method: string;
    payment_status: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    address: Address;
    shipment?: {
        id: number;
        tracking_number: string;
        awb_code: string;
        shipping_provider: string;
        status: string;
        created_at: string;
    };

}

const OrderShow = () => {
    const { order } = usePage().props as any;
    const { formatMoney } = useFormatMoney();

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

    return (
        <AppLayout>
            <Container className="py-8">
                <div className="mb-6">
                    <Link
                        href={route('orders.index')}
                        className="text-primary hover:text-primary/80"
                    >
                        ← Back to Orders
                    </Link>
                </div>

                {/* Order Header */}
                <div className="mb-6 rounded-div bg-white p-6 shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h1 className="mb-2 text-2xl font-bold">
                                Order #{order.order_number}
                            </h1>
                            <p className="mb-1 text-sm text-gray-600">
                                Placed on {formatDate(order.created_at)}
                            </p>
                            <p className="text-sm text-gray-600">
                                Last updated: {formatDate(order.updated_at)}
                            </p>
                        </div>
                        <div className="text-left md:text-right">
                            <span
                                className={`mb-2 inline-block rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                                    order.status,
                                )}`}
                            >
                                {order.status.toUpperCase()}
                            </span>
                            <p className="text-sm text-gray-600">
                                Payment Status:{' '}
                                <span
                                    className={`rounded px-2 py-1 text-xs ${getPaymentStatusColor(
                                        order.payment_status,
                                    )}`}
                                >
                                    {order.payment_status.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="mb-6 rounded-div bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-bold">
                        Order Summary
                    </h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Amount
                            </p>
                            <p className="text-lg font-bold text-primary">
                                {formatMoney(order.total_amount, {
                                    showDecimals: true,
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Payment Method
                            </p>
                            <p className="font-semibold uppercase">
                                {order.payment_method}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Items
                            </p>
                            <p className="font-semibold">
                                {order.items.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Quantity
                            </p>
                            <p className="font-semibold">
                                {order.items.reduce(
                                    (sum: number, item: OrderItem) =>
                                        sum + item.quantity,
                                    0,
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6 rounded-div bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-bold">
                        Delivery Address
                    </h2>
                    <div className="rounded bg-gray-50 p-4">
                        <p className="mb-1 font-bold">
                            {order.address.full_name}
                        </p>
                        <p className="text-sm text-gray-700">
                            {order.address.address_line1}
                        </p>
                        {order.address.address_line2 && (
                            <p className="text-sm text-gray-700">
                                {order.address.address_line2}
                            </p>
                        )}
                        {order.address.landmark && (
                            <p className="text-sm text-gray-600">
                                Landmark: {order.address.landmark}
                            </p>
                        )}
                        <p className="text-sm text-gray-700">
                            {order.address.city}, {order.address.state} -{' '}
                            {order.address.pincode}
                        </p>
                        <p className="text-sm text-gray-700">
                            {order.address.country}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            Phone: {order.address.phone}
                        </p>
                        {order.address.alternate_phone && (
                            <p className="text-sm text-gray-600">
                                Alternate: {order.address.alternate_phone}
                            </p>
                        )}
                    </div>
                </div>

                {/* Order Items */}
                <div className="rounded-div bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-bold">
                        Order Items ({order.items.length})
                    </h2>
                    <div className="space-y-4">
                        {order.items.map((item: OrderItem) => (
                            <div
                                key={item.id}
                                className="flex items-center border-b pb-4"
                            >
                                <Link
                                    href={route(
                                        'product.show',
                                        item.product.slug,
                                    )}
                                    className="cursor-pointer"
                                >
                                    <img
                                        src={
                                            item.product.thumbnail ||
                                            item.product.image
                                        }
                                        alt={item.product.title}
                                        className="mr-4 h-20 w-20 rounded object-cover transition-opacity hover:opacity-75"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <Link
                                        href={route(
                                            'product.show',
                                            item.product.slug,
                                        )}
                                        className="cursor-pointer"
                                    >
                                        <h3 className="font-semibold transition-colors hover:text-primary">
                                            {item.product.title}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-gray-600">
                                        Price:{' '}
                                        {formatMoney(item.price, {
                                            showDecimals: true,
                                        })}{' '}
                                        × {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">
                                        {formatMoney(item.subtotal, {
                                            showDecimals: true,
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="mt-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Subtotal
                                </p>
                                <p className="text-sm text-gray-600">
                                    Shipping
                                </p>
                                <p className="mt-2 text-lg font-bold">
                                    Total
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm">
                                    {formatMoney(order.total_amount, {
                                        showDecimals: true,
                                    })}
                                </p>
                                <p className="text-sm font-semibold text-accent">
                                    FREE
                                </p>
                                <p className="mt-2 text-xl font-bold text-primary">
                                    {formatMoney(order.total_amount, {
                                        showDecimals: true,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                
                <UserShippingSection orderId={order.id} shipment={order.shipment} />
            </Container>
        </AppLayout>
    );
};

export default OrderShow;
