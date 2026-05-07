interface Props {
    id: number;
    product_title: string;
    sku: string | null;
    quantity: number;
    thumbnail?: string | null;
    serial_numbers?: string[];
    onSerialsClick?: (productTitle: string, serials: string[]) => void;
}

export default function StockCard({ id, product_title, sku, quantity, thumbnail, serial_numbers = [], onSerialsClick }: Props) {
    const isLimited = quantity > 0 && quantity <= 10;

    return (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* Image */}
            <div className="relative aspect-[16/9] w-full bg-gray-100">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={product_title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        No image available
                    </div>
                )}
                {isLimited && (
                    <div className="absolute right-3 top-3 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow">
                        Limited
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5">
                <div className="line-clamp-2 text-lg font-semibold text-gray-900">{product_title}</div>
                <div className="mt-1 text-sm text-gray-500">SKU: {sku ?? '—'}</div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">On hand</div>
                    <div className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                        {quantity}
                    </div>
                </div>

                {serial_numbers.length > 0 && onSerialsClick && (
                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={() => onSerialsClick(product_title, serial_numbers)}
                            className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 focus:outline-none"
                        >
                            {serial_numbers.length} serial{serial_numbers.length !== 1 ? 's' : ''} available
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
