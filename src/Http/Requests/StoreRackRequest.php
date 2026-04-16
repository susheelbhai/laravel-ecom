<?php

namespace App\Http\Requests;

use App\Models\WarehouseRack;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreRackRequest extends FormRequest
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
            'identifier' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                // Get warehouse_id from route parameter
                $warehouseId = $this->route('warehouse')->id ?? null;

                if (! $warehouseId) {
                    return;
                }

                // Check if identifier is unique within the warehouse
                $exists = WarehouseRack::where('warehouse_id', $warehouseId)
                    ->where('identifier', $this->identifier)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add(
                        'identifier',
                        'A rack with this identifier already exists in this warehouse.'
                    );
                }
            },
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
            'identifier.required' => 'Rack identifier is required.',
            'identifier.max' => 'Rack identifier must not exceed 255 characters.',
            'description.max' => 'Rack description must not exceed 1000 characters.',
        ];
    }
}
