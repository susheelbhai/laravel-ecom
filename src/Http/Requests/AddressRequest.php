<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
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
        return [
            'type' => ['required', 'string', 'max:255'],
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'alternate_phone' => ['nullable', 'string', 'max:20'],
            'address_line1' => ['required', 'string', 'max:500'],
            'address_line2' => ['nullable', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:255'],
            'state_id' => ['required', 'integer', 'exists:states,id'],
            'country' => ['required', 'string', 'max:255'],
            'pincode' => ['required', 'string', 'max:10'],
            'landmark' => ['nullable', 'string', 'max:255'],
            'is_default' => ['nullable', 'boolean'],
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
            'type.required' => 'Address type is required.',
            'full_name.required' => 'Full name is required.',
            'phone.required' => 'Phone number is required.',
            'address_line1.required' => 'Address line 1 is required.',
            'city.required' => 'City is required.',
            'state.required' => 'State is required.',            'country.required' => 'Country is required.',
            'pincode.required' => 'Pincode is required.',
        ];
    }
}
