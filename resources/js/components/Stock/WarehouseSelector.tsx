import { InputDiv } from '@/components/form/container/input-div';
import type { InputDivProps } from '@/components/form/container/input-types';

type Warehouse = {
    id: number;
    name: string;
};

type WarehouseSelectorProps = {
    warehouses: Warehouse[];
    inputDivData: NonNullable<InputDivProps['inputDivData']>;
    name?: string;
    label?: string;
    disabled?: boolean;
    onChange?: (warehouseId: string) => void;
};

export function WarehouseSelector({
    warehouses,
    inputDivData,
    name = 'warehouse_id',
    label = 'Warehouse',
    disabled = false,
    onChange,
}: WarehouseSelectorProps) {
    const customInputDivData = onChange
        ? {
              ...inputDivData,
              setData: (key: string, value: any) => {
                  inputDivData.setData(key, value);
                  if (key === name) {
                      onChange(value);
                  }
              },
          }
        : inputDivData;

    return (
        <InputDiv
            type="select"
            label={label}
            name={name}
            inputDivData={customInputDivData}
            disabled={disabled}
            options={[
                { value: '', label: 'Select a warehouse' },
                ...warehouses.map((w) => ({
                    value: w.id.toString(),
                    label: w.name,
                })),
            ]}
        />
    );
}
