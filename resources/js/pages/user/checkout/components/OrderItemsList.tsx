import { useFormatMoney } from '@/hooks/use-format-money';
import {
    handleProductImageError,
    PRODUCT_FALLBACK_IMAGE_URL,
} from '@/lib/product-image-fallback';

const FALLBACK_IMAGE = PRODUCT_FALLBACK_IMAGE_URL;

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        title: string;
        slug: string;
        thumbnail: string;
        image: string;
    };
}

interface OrderItemsListProps {
    items: CartItem[];
}

export const OrderItemsList = ({ items }: OrderItemsListProps) => {
    const { formatMoney } = useFormatMoney();

    return (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">
                Order Items ({items.length})
            </h2>
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center border-b border-border pb-4 last:border-b-0"
                    >
                        <img
                            src={
                                item.product.thumbnail ||
                                item.product.image ||
                                FALLBACK_IMAGE
                            }
                            alt={item.product.title}
                            onError={handleProductImageError}
                            className="mr-4 h-16 w-16 rounded border border-border object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                                {item.product.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-foreground">
                                {formatMoney(item.price * item.quantity, {
                                    showDecimals: true,
                                })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatMoney(item.price, {
                                    showDecimals: true,
                                })}{' '}
                                each
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
