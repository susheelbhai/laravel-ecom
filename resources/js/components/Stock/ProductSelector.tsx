import { InputDiv } from '@/components/form/container/input-div';
import type { InputDivProps } from '@/components/form/container/input-types';

type Product = {
    id: number;
    title: string;
    sku?: string;
};

type ProductSelectorProps = {
    products: Product[];
    inputDivData: NonNullable<InputDivProps['inputDivData']>;
    name?: string;
    label?: string;
    disabled?: boolean;
};

export function ProductSelector({
    products,
    inputDivData,
    name = 'product_id',
    label = 'Product',
    disabled = false,
}: ProductSelectorProps) {
    return (
        <InputDiv
            type="select"
            label={label}
            name={name}
            inputDivData={inputDivData}
            disabled={disabled}
            options={[
                { value: '', label: 'Select a product' },
                ...products.map((p) => ({
                    value: p.id.toString(),
                    label: p.sku ? `${p.title} (${p.sku})` : p.title,
                })),
            ]}
        />
    );
}
