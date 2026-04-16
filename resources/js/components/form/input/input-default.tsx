import React from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InputDivProps } from '../container/input-types';
import { InputWrapper } from '../container/input-wrapper';

export default function InputDefault({
    label,
    name = '',
    inputDivData,
    type,
    readOnly,
    required,
    className,
    ...props
}: InputDivProps) {
    const { data, setData, errors } = inputDivData || {
        data: {},
        setData: () => {},
        errors: {},
    };

    return (
        <InputWrapper className={className}>
            <Label htmlFor={name}>
                {label}
                {required && (
                    <span className="text-xl font-bold text-red-500">*</span>
                )}
            </Label>
            <Input
                id={name}
                type={type}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
                readOnly={readOnly}
                className="border-input-border bg-input-bg text-input-text placeholder:text-input-placeholder hover:bg-input-hover-bg focus:bg-input-focused-bg focus:text-input-focused-text"
                {...props}
            />
            <InputError message={errors?.[name]?.[0]} />
        </InputWrapper>
    );
}
