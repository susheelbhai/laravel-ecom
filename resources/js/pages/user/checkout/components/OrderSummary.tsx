import { Link } from '@inertiajs/react';
import { useFormatMoney } from '@/hooks/use-format-money';

interface OrderSummaryProps {
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: 'cod' | 'online';
    processing: boolean;
    selectedAddressId: number | null;
    onSubmit: (e: React.FormEvent) => void;
}

export const OrderSummary = ({
    subtotal,
    discount,
    total,
    paymentMethod,
    processing,
    selectedAddressId,
    onSubmit,
}: OrderSummaryProps) => {
    const { formatMoney } = useFormatMoney();

    return (
        <div className="sticky top-4 rounded-div border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">
                Order Summary
            </h2>

            <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold text-foreground">
                        {formatMoney(subtotal, { showDecimals: true })}
                    </span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-accent">
                        <span className="font-semibold">Discount:</span>
                        <span className="font-semibold">
                            - {formatMoney(discount, { showDecimals: true })}
                        </span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-semibold text-accent">FREE</span>
                </div>
                <div className="mt-2 border-t border-border pt-2">
                    <div className="flex justify-between text-lg">
                        <span className="font-bold text-foreground">
                            Total:
                        </span>
                        <span className="font-bold text-primary">
                            {formatMoney(total, { showDecimals: true })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-4 rounded bg-muted p-4">
                <p className="text-sm text-foreground">
                    <strong>Payment Method:</strong>{' '}
                    {paymentMethod === 'cod'
                        ? 'Cash on Delivery (COD)'
                        : 'Online Payment'}
                </p>
            </div>

            <form onSubmit={onSubmit}>
                <button
                    type="submit"
                    disabled={processing || !selectedAddressId}
                    className="w-full rounded bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                    {processing ? 'Processing...' : 'Place Order'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <Link
                    href={route('cart.index')}
                    className="text-sm text-primary hover:text-primary/80"
                >
                    ← Back to Cart
                </Link>
            </div>
        </div>
    );
};
