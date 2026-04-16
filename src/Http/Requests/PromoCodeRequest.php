<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PromoCodeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $promoCodeId = $this->route('promo_code') ? $this->route('promo_code')->id : null;

        return [
            'code' => ['required', 'string', 'max:50', 'unique:promo_codes,code,'.$promoCodeId],
            'description' => ['nullable', 'string', 'max:500'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'per_user_limit' => ['nullable', 'integer', 'min:1'],
            'partner_id' => ['nullable', 'exists:partners,id'],
            // 'is_active' => ['required', 'boolean'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after:valid_from'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Promo code is required.',
            'code.unique' => 'This promo code already exists.',
            'discount_type.required' => 'Discount type is required.',
            'discount_type.in' => 'Discount type must be either percentage or fixed.',
            'discount_value.required' => 'Discount value is required.',
            'discount_value.min' => 'Discount value must be at least 0.',
            'valid_until.after' => 'Valid until date must be after valid from date.',
        ];
    }
}
