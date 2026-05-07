<?php

namespace App\Http\Requests\B2B;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDealerOrderPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('distributor') !== null;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', Rule::in(PaymentMethod::values())],
            'note' => ['nullable', 'string', 'max:2000'],
            'payment_proof' => ['nullable', 'file', 'mimes:jpeg,png,pdf', 'max:5120'],
        ];
    }
}
