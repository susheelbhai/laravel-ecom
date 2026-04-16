import { usePage } from '@inertiajs/react';

interface FormatMoneyOptions {
    currency?: string;
    showDecimals?: boolean;
    locale?: string;
}

export const useFormatMoney = () => {
    // Get default currency from appData if available, otherwise use '₹'
    const { appData } = usePage().props as any;
    const defaultCurrency = appData?.currency || '₹';

    const formatMoney = (
        amount: number | string | null | undefined,
        options: FormatMoneyOptions = {},
    ): string => {
        const {
            currency = defaultCurrency,
            showDecimals = false,
            locale = 'en-IN',
        } = options;

        if (amount === null || amount === undefined) {
            return `${currency}0`;
        }

        // Convert string to number if needed
        const numericAmount =
            typeof amount === 'string' ? parseFloat(amount) : amount;

        // Handle invalid numbers
        if (isNaN(numericAmount)) {
            return `${currency}0`;
        }

        // Format the number with locale
        const formattedNumber = numericAmount.toLocaleString(locale, {
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        });

        return `${currency}${formattedNumber}`;
    };

    return { formatMoney, defaultCurrency };
};
