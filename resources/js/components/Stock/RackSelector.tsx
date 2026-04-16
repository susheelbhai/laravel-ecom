import { InputDiv } from '@/components/form/container/input-div';
import type { InputDivProps } from '@/components/form/container/input-types';

type Rack = {
    id: number;
    identifier: string;
};

type RackSelectorProps = {
    racks: Rack[];
    inputDivData: NonNullable<InputDivProps['inputDivData']>;
    name?: string;
    label?: string;
    disabled?: boolean;
    warehouseSelected?: boolean;
};

export function RackSelector({
    racks,
    inputDivData,
    name = 'rack_id',
    label = 'Rack',
    disabled = false,
    warehouseSelected = true,
}: RackSelectorProps) {
    return (
        <InputDiv
            type="select"
            label={label}
            name={name}
            inputDivData={inputDivData}
            disabled={disabled || !warehouseSelected}
            options={[
                {
                    value: '',
                    label: warehouseSelected
                        ? 'Select a rack'
                        : 'Select a warehouse first',
                },
                ...racks.map((r) => ({
                    value: r.id.toString(),
                    label: r.identifier,
                })),
            ]}
        />
    );
}
