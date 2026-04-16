<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class RecordStockMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'rack_id' => ['required', 'exists:warehouse_racks,id'],
            'type' => ['required', Rule::in(['in', 'out', 'adjustment'])],
            'quantity' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    // For 'in' and 'out' types, quantity must be positive
                    if (in_array($this->type, ['in', 'out']) && $value < 1) {
                        $fail('Quantity must be at least 1 for stock in/out operations.');
                    }
                    // For adjustments, any integer is allowed (positive or negative)
                },
            ],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($this->type === 'out') {
                    $currentStock = \App\Models\StockMovement::calculateCurrentStock(
                        $this->product_id,
                        $this->rack_id
                    );

                    if ($currentStock < $this->quantity) {
                        $validator->errors()->add(
                            'quantity',
                            "Insufficient stock. Available: {$currentStock}, Requested: {$this->quantity}"
                        );
                    }
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Product is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'rack_id.required' => 'Rack is required.',
            'rack_id.exists' => 'The selected rack does not exist.',
            'type.required' => 'Movement type is required.',
            'type.in' => 'Invalid movement type.',
            'quantity.required' => 'Quantity is required.',
            'quantity.integer' => 'Quantity must be a whole number.',
            'quantity.min' => 'Quantity must be at least 1.',
            'reason.max' => 'Reason cannot exceed 500 characters.',
        ];
    }
}
