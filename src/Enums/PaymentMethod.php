<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cash = 'cash';
    case BankTransfer = 'bank_transfer';
    case Cheque = 'cheque';
    case Upi = 'upi';
    case Other = 'other';

    /**
     * Returns an array of all string values.
     * Useful for validation rules: Rule::in(PaymentMethod::values()).
     *
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
