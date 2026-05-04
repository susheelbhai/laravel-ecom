import { Link, usePage } from '@inertiajs/react';
import { Container } from '@/components/ui/layout/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import AppLayout from '@/layouts/user/app-layout';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        id: number;
        title: string;
        thumbnail: string;
        image: string;
    };
}

interface Address {
    id: number;
    full_name: string;
    city: string;
    state: string;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_method: string;
    payment_status: string;
    created_at: string;
    items: OrderItem[];
    address: Address;
}

const OrdersIndex = () => {
    const { orders = [] } = usePage().props as any;
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
        });
    };

    return (
        <AppLayout>
            <Container className="py-8">
                <h1 className="mb-6 text-3xl font-bold">My Orders</h1>

                {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order: Order) => (
                            <Link
                                key={order.id}
                                href={route('orders.show', order.id)}
                                className="block cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <div className="mb-2 flex items-center gap-3">
                                            <h2 className="text-lg font-bold">
                                                Order #{order.order_number}
                                            </h2>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                                    order.status,
                                                )}`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Placed on{' '}
                                            {formatDate(order.created_at)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Items:{' '}
                                            <span className="font-semibold">
                                                {order.items.length}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Payment:{' '}
                                            <span
                                                className={`rounded px-2 py-0.5 text-xs ${getPaymentStatusColor(
                                                    order.payment_status,
                                                )}`}
                                            >
                                                {order.payment_status.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="mb-1 text-sm text-gray-600">
                                            Total Amount
                                        </p>
                                        <p className="text-2xl font-bold text-primary">
                                            {formatMoney(order.total_amount, {
                                                showDecimals: true,
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500 uppercase">
                                            {order.payment_method}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg bg-white py-12 text-center shadow">
                        <p className="mb-4 text-gray-600">
                            You haven't placed any orders yet.
                        </p>
                        <Link
                            href={route('product.index')}
                            className="inline-block rounded bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </Container>
        </AppLayout>
    );
};

export default OrdersIndex;
