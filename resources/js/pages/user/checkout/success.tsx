import { Link } from '@inertiajs/react';
import { Container } from '@/components/ui/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import {
    handleProductImageError,
    PRODUCT_FALLBACK_IMAGE_URL,
} from '@/lib/product-image-fallback';
import AppLayout from '@/layouts/user/app-layout';

const FALLBACK_IMAGE = PRODUCT_FALLBACK_IMAGE_URL;

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        slug: string;
        id: number;
        title: string;
        thumbnail: string;
        image: string;
    };
}

interface Address {
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

interface OrderSuccessProps {
    order: Order;
}

const OrderSuccess = ({ order }: OrderSuccessProps) => {
    const { formatMoney } = useFormatMoney();

    return (
        <AppLayout title="Order Placed Successfully">
            <Container className="py-8">
                <div className="mx-auto max-w-3xl">
                    {/* Success Message */}
                    <div className="mb-6 rounded-lg border border-accent/30 bg-accent/10 p-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                            <div className="text-3xl text-white">✓</div>
                        </div>
                        <h1 className="mb-2 text-2xl font-bold text-accent">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-gray-600">
                            Thank you for your order. We'll send you a
                            confirmation email shortly.
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="mb-6 rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-bold">
                            Order Details
                        </h2>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Order Number
                                </p>
                                <p className="font-semibold">
                                    {order.order_number}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Amount
                                </p>
                                <p className="font-semibold text-primary">
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
                                    Payment Status
                                </p>
                                <p className="font-semibold capitalize">
                                    {order.payment_status}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6 rounded-lg bg-white p-6 shadow">
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
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6 rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-bold">
                            Order Items ({order.items.length})
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center border-b pb-4"
                                >
                                   <Link href={route('product.show', item.product.slug)}>
                                    <img
                                        src={
                                            item.product.thumbnail ||
                                            item.product.image ||
                                            FALLBACK_IMAGE
                                        }
                                        alt={item.product.title}
                                        onError={handleProductImageError}
                                        className="mr-4 h-16 w-16 rounded object-cover"
                                    />
                                    </Link>
                                    <div className="flex-1">
                                        <Link href={route('product.show', item.product.slug)} className="font-semibold">
                                            {item.product.title}
                                        </Link>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {formatMoney(item.subtotal, {
                                                showDecimals: true,
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {formatMoney(item.price, {
                                                showDecimals: true,
                                            })}{' '}
                                            each
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between text-lg">
                                <span className="font-bold">Total:</span>
                                <span className="font-bold text-primary">
                                    {formatMoney(order.total_amount, {
                                        showDecimals: true,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                        <Link
                            href={route('home')}
                            className="rounded bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href={route('orders.index')}
                            className="rounded bg-muted px-6 py-3 text-foreground transition-colors hover:bg-muted/80"
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>
            </Container>
        </AppLayout>
    );
};

export default OrderSuccess;
