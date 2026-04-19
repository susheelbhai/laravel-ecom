import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncSelect from 'react-select/async';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import type { InputDivProps } from '../container/input-types';
import { InputWrapper } from '../container/input-wrapper';

type Option = { value: string; label: string };

type EndpointResult = { id: number | string; label: string };
type EndpointPayload = { results: EndpointResult[] };

const selectStyles = {
    menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
    menu: (base: Record<string, unknown>) => ({
        ...base,
        backgroundColor: 'var(--input-bg)',
        border: '1px solid var(--input-border)',
        borderRadius: '6px',
    }),
    option: (
        base: Record<string, unknown>,
        state: { isFocused: boolean; isSelected: boolean },
    ) => ({
        ...base,
        backgroundColor:
            state.isFocused || state.isSelected
                ? 'var(--accent)'
                : 'var(--input-bg)',
        color:
            state.isFocused || state.isSelected
                ? 'var(--accent-foreground)'
                : 'var(--input-text)',
    }),
    control: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
        ...base,
        backgroundColor: state.isFocused
            ? 'var(--input-focused-bg)'
            : 'var(--input-bg)',
        borderColor: state.isFocused ? 'var(--secondary)' : 'var(--input-border)',
        '&:hover': {
            borderColor: 'var(--secondary)',
        },
        color: state.isFocused ? 'var(--input-focused-text)' : 'var(--input-text)',
    }),
};

export default function InputAsyncSelect({
    label,
    name = '',
    inputDivData,
    required,
    className,
    disabled,
    placeholder = 'Type to search…',
    fetchUrl,
    fetchRouteName,
    fetchQueryParam = 'q',
    minSearchLength = 2,
}: InputDivProps) {
    const { data, setData, errors } = inputDivData || {
        data: {},
        setData: () => {},
        errors: {},
    };

    const idStr =
        data?.[name] !== undefined &&
        data?.[name] !== null &&
        String(data[name]).length > 0
            ? String(data[name])
            : '';

    const [selected, setSelected] = useState<Option | null>(null);

    useEffect(() => {
        if (!idStr) {
            setSelected(null);
        }
    }, [idStr]);

    const endpointUrl = useMemo(() => {
        if (fetchUrl && fetchUrl.trim().length > 0) {
            return fetchUrl;
        }

        if (fetchRouteName && fetchRouteName.trim().length > 0) {
            return route(fetchRouteName.trim());
        }

        return null;
    }, [fetchRouteName, fetchUrl]);

    const loadOptions = useCallback(
        async (inputValue: string): Promise<Option[]> => {
            const term = inputValue.trim();

            if (!endpointUrl) {
                return [];
            }

            if (term.length < minSearchLength) {
                return [];
            }

            const { data: payload } = await axios.get<EndpointPayload>(
                endpointUrl,
                {
                    params: { [fetchQueryParam]: term },
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );

            return (payload.results || []).map((r) => ({
                value: String(r.id),
                label: String(r.label),
            }));
        },
        [endpointUrl, fetchQueryParam, minSearchLength],
    );

    return (
        <InputWrapper className={className}>
            <Label htmlFor={name}>
                {label}
                {required && (
                    <span className="text-xl font-bold text-red-500">*</span>
                )}
            </Label>

            <AsyncSelect<Option, false>
                inputId={name}
                instanceId={`async-select-${name}`}
                cacheOptions={false}
                defaultOptions={false}
                loadOptions={loadOptions}
                value={selected}
                onChange={(opt) => {
                    const next = opt ?? null;

                    setSelected(next);
                    setData(name, next?.value ?? '');
                }}
                placeholder={placeholder}
                isClearable
                isDisabled={disabled || !endpointUrl}
                loadingMessage={() => 'Searching…'}
                noOptionsMessage={({ inputValue }) =>
                    inputValue.trim().length < minSearchLength
                        ? `Type at least ${minSearchLength} characters`
                        : 'No results found'
                }
                className="react-select-container rounded-md border-2 border-input-border"
                classNamePrefix="react-select"
                menuPortalTarget={
                    typeof document !== 'undefined' ? document.body : null
                }
                styles={selectStyles}
            />

            <InputError message={errors?.[name]?.[0]} />
        </InputWrapper>
    );
}

