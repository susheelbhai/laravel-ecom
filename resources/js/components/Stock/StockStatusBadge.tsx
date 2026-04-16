type StockStatusBadgeProps = {
    quantity: number;
    lowStockThreshold?: number;
};

export function StockStatusBadge({
    quantity,
    lowStockThreshold = 10,
}: StockStatusBadgeProps) {
    let status: 'out-of-stock' | 'low-stock' | 'in-stock';
    let label: string;
    let colorClasses: string;

    if (quantity === 0) {
        status = 'out-of-stock';
        label = 'Out of Stock';
        colorClasses = 'bg-red-100 text-red-800';
    } else if (quantity < lowStockThreshold) {
        status = 'low-stock';
        label = 'Low Stock';
        colorClasses = 'bg-yellow-100 text-yellow-800';
    } else {
        status = 'in-stock';
        label = 'In Stock';
        colorClasses = 'bg-green-100 text-green-800';
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}
            data-status={status}
        >
            {label}
        </span>
    );
}
