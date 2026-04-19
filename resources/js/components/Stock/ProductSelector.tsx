import InputDiv from '@/components/form/container/input-div';

type ProductSelectorProps = {
    inputDivData: {
        data: Record<string, unknown>;
        setData: (key: string, value: unknown) => void;
        errors?: Record<string, string[]>;
    };
    name?: string;
    label?: string;
    disabled?: boolean;
};

/**
 * Searchable product picker (server-backed async select). Does not load the full catalog.
 */
export function ProductSelector({
    inputDivData,
    name = 'product_id',
    label = 'Product',
    disabled = false,
}: ProductSelectorProps) {
    return (
        <InputDiv
            type="async-select"
            label={label}
            name={name}
            inputDivData={inputDivData}
            disabled={disabled}
            fetchRouteName="admin.stock.products.search"
            fetchQueryParam="q"
            minSearchLength={2}
            placeholder="Type at least 2 characters to search…"
        />
    );
}
