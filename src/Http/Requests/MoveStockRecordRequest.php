<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class MoveStockRecordRequest extends FormRequest
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
            'rack_id' => ['required', 'exists:warehouse_racks,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $stockRecord = $this->route('record');

                // Check if moving to the same rack
                if ($stockRecord && $stockRecord->rack_id == $this->rack_id) {
                    $validator->errors()->add(
                        'rack_id',
                        'Cannot move to the same rack location.'
                    );
                }

                // Check if quantity exceeds available stock
                if ($stockRecord && $this->quantity > $stockRecord->quantity) {
                    $validator->errors()->add(
                        'quantity',
                        'Cannot move more than available stock ('.$stockRecord->quantity.' units).'
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
            'rack_id.required' => 'Target rack is required.',
            'rack_id.exists' => 'The selected rack does not exist.',
            'quantity.required' => 'Quantity to move is required.',
            'quantity.integer' => 'Quantity must be a valid number.',
            'quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}
