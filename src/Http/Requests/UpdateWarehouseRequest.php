<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWarehouseRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', Rule::unique('warehouses', 'name')->ignore($this->route('warehouse'))],
            'address' => ['required', 'string', 'max:1000'],
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
            'name.required' => 'Warehouse name is required.',
            'name.unique' => 'A warehouse with this name already exists.',
            'name.max' => 'Warehouse name must not exceed 255 characters.',
            'address.required' => 'Warehouse address is required.',
            'address.max' => 'Warehouse address must not exceed 1000 characters.',
        ];
    }
}
