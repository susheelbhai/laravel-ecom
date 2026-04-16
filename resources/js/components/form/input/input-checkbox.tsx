import React from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import type { InputDivProps } from '../container/input-types';
import { InputWrapper } from '../container/input-wrapper';

export default function InputCheckbox({
    label,
    name = '',
    inputDivData,
    required,
    className,
}: InputDivProps) {
    const { data, setData, errors } = inputDivData || {
        data: {},
        setData: () => {},
        errors: {},
    };

    // Normalize to boolean
    const checked =
        data?.[name] === true || data?.[name] === 1 || data?.[name] === '1';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(name, e.target.checked ? 1 : 0);
    };

    return (
        <InputWrapper className={className}>
            <div className="flex items-center gap-2">
                <input
                    id={name}
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    required={required}
                    className="h-5 w-5 cursor-pointer appearance-auto rounded-md border-2 border-input-border bg-input-bg accent-secondary transition checked:border-input-border checked:bg-secondary focus:ring-2 focus:ring-secondary focus:ring-offset-0 focus:ring-offset-input-bg"
                />
                <Label
                    htmlFor={name}
                    className="cursor-pointer text-foreground"
                >
                    {label}
                    {required && (
                        <span className="text-xl font-bold text-red-500">
                            *
                        </span>
                    )}
                </Label>
            </div>

            <InputError message={errors?.[name]?.[0]} />
        </InputWrapper>
    );
}
