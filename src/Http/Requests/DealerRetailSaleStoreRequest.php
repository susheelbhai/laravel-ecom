<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DealerRetailSaleStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('dealer') !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'customer_email' => $this->filled('customer_email') ? $this->input('customer_email') : null,
            'billing_address_line2' => $this->filled('billing_address_line2') ? $this->input('billing_address_line2') : null,
            'billing_country' => $this->filled('billing_country') ? $this->input('billing_country') : 'India',
            'customer_gstin' => $this->filled('customer_gstin') ? $this->input('customer_gstin') : null,
            'unit_price' => $this->filled('unit_price') ? $this->input('unit_price') : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'serial_numbers' => ['nullable', 'array'],
            'serial_numbers.*' => ['string'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:32'],
            'billing_address_line1' => ['required', 'string', 'max:255'],
            'billing_address_line2' => ['nullable', 'string', 'max:255'],
            'billing_city' => ['required', 'string', 'max:120'],
            'billing_state' => ['required', 'string', 'max:120'],
            'billing_pincode' => ['required', 'string', 'max:16'],
            'billing_country' => ['nullable', 'string', 'max:64'],
            'customer_gstin' => ['nullable', 'string', 'max:32'],
        ];
    }
}
