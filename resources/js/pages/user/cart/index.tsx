import { usePage, router, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { useFormatMoney } from '@/hooks/use-format-money';
import AppLayout from '@/layouts/user/app-layout';

const FALLBACK_IMAGE = '/images/no-image.svg';

const CartIndex = () => {
    const { cart } = usePage().props as any;
    const { formatMoney } = useFormatMoney();

    const handleUpdate = (item: any, newQuantity: number) => {
        if (newQuantity < 1) return;

        router.patch(
            route('cart.update', item.id),
            {
                quantity: newQuantity,
            },
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    const handleRemove = (itemId: number) => {
        router.delete(route('cart.remove', itemId), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce(
            (total: number, item: any) => total + item.price * item.quantity,
            0,
        );
    };

    return (
        <AppLayout title="Shopping Cart">
            <div className="bg-background">
                <Container className="py-8">
                    <h1 className="mb-8 text-3xl font-bold text-foreground">
                        Shopping Cart
                    </h1>
                    {cart && cart.items && cart.items.length > 0 ? (
                        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                            {/* Header */}
                            <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted px-6 py-4 font-semibold text-muted-foreground">
                                <div className="col-span-5">ITEM NAME</div>
                                <div className="col-span-2 text-center">
                                    PRICE
                                </div>
                                <div className="col-span-3 text-center">
                                    QUANTITY
                                </div>
                                <div className="col-span-2 text-right">
                                    TOTAL
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-border">
                                {cart.items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-12 items-center gap-4 px-6 py-6 transition-colors hover:bg-muted/50"
                                    >
                                        {/* Item Name with Image */}
                                        <div className="col-span-5 flex items-center gap-4">
                                            <Link
                                                href={route(
                                                    'product.show',
                                                    item.product.slug,
                                                )}
                                                className="flex-shrink-0"
                                            >
                                                <img
                                                    src={
                                                        item.product.thumbnail ||
                                                        item.product.image ||
                                                        item.product.display_img ||
                                                        FALLBACK_IMAGE
                                                    }
                                                    alt={item.product.title}
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            FALLBACK_IMAGE;
                                                    }}
                                                    className="h-20 w-20 rounded-lg border border-border object-cover"
                                                />
                                            </Link>
                                            <Link
                                                href={route(
                                                    'product.show',
                                                    item.product.slug,
                                                )}
                                                className="flex-1"
                                            >
                                                <h3 className="font-semibold text-foreground hover:text-primary">
                                                    {item.product.title}
                                                </h3>
                                            </Link>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-2 text-center font-semibold text-secondary">
                                            {formatMoney(item.price, {
                                                showDecimals: true,
                                            })}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="col-span-3 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleUpdate(
                                                        item,
                                                        item.quantity - 1,
                                                    )
                                                }
                                                disabled={item.quantity <= 1}
                                                className="flex h-8 w-8 items-center justify-center rounded border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="flex h-8 w-12 items-center justify-center rounded border border-border bg-card font-medium text-foreground">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleUpdate(
                                                        item,
                                                        item.quantity + 1,
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded border border-border bg-card text-secondary transition-colors hover:bg-muted"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-1 text-right font-bold text-secondary">
                                            {formatMoney(
                                                item.price * item.quantity,
                                                {
                                                    showDecimals: true,
                                                },
                                            )}
                                        </div>

                                        {/* Remove Button */}
                                        <div className="col-span-1 flex justify-end">
                                            <button
                                                onClick={() =>
                                                    handleRemove(item.id)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                                title="Remove item"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Footer */}
                            <div className="border-t border-border bg-muted px-6 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-semibold text-foreground">
                                        Cart Total:
                                    </div>
                                    <div className="text-2xl font-bold text-secondary">
                                        {formatMoney(calculateTotal(), {
                                            showDecimals: true,
                                        })}
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-4">
                                    <Link
                                        href={route('product.index')}
                                        className="rounded-lg border-2 border-border bg-card px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
                                    >
                                        Continue Shopping
                                    </Link>
                                    <Link
                                        href={route('checkout.index')}
                                        className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-border bg-card p-12 text-center shadow-sm">
                            <p className="mb-4 text-lg text-muted-foreground">
                                Your cart is empty.
                            </p>
                            <Link
                                href={route('product.index')}
                                className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </Container>
            </div>
        </AppLayout>
    );
};

export default CartIndex;
