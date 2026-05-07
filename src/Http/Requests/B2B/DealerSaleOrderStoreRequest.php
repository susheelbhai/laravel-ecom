<?php

namespace App\Http\Requests\B2B;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DealerSaleOrderStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('distributor') !== null;
    }

    public function rules(): array
    {
        $paymentStatus = $this->input('payment_status');

        return [
            'dealer_id' => ['required', 'integer', 'exists:dealers,id'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'serial_numbers' => ['nullable', 'array'],
            'serial_numbers.*' => ['string'],

            // Payment fields (optional at order creation)
            'payment_status' => ['nullable', Rule::in(array_column(PaymentStatus::cases(), 'value'))],
            'amount_paid' => [
                Rule::when(
                    $paymentStatus === PaymentStatus::Partial->value,
                    ['required', 'numeric', 'min:0.01'],
                    ['nullable', 'numeric', 'min:0.01'],
                ),
            ],
            'payment_method' => [
                Rule::when(
                    in_array($paymentStatus, [PaymentStatus::Partial->value, PaymentStatus::Paid->value], true),
                    ['required', Rule::in(PaymentMethod::values())],
                    ['nullable', Rule::in(PaymentMethod::values())],
                ),
            ],
            'note' => ['nullable', 'string', 'max:2000'],
            'payment_proof' => ['nullable', 'file', 'mimes:jpeg,png,pdf', 'max:5120'],
        ];
    }
}
