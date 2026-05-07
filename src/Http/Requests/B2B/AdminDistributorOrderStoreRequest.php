<?php

namespace App\Http\Requests\B2B;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminDistributorOrderStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    public function rules(): array
    {
        $paymentStatus = $this->input('payment_status');

        return [
            'distributor_id' => ['required', 'integer', 'exists:distributors,id'],
            'source_rack_id' => ['required', 'integer', 'exists:warehouse_racks,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['nullable', 'numeric', 'min:0'],
            'items.*.serial_numbers' => ['nullable', 'array'],
            'items.*.serial_numbers.*' => ['string'],

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
