<?php

namespace App\Http\Requests;

use App\Models\SerialNumber;
use App\Models\WarehouseRack;
use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rack_id' => ['required', 'exists:warehouse_racks,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['nullable', 'string', 'max:255'],
            'serial_numbers' => ['nullable', 'array'],
            'serial_numbers.*' => ['string'],
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

                // Target rack must belong to an admin warehouse — stock moves are internal only.
                if ($this->rack_id) {
                    $targetRack = WarehouseRack::with('warehouse:id,owner_type')
                        ->find($this->rack_id);
                    if ($targetRack && $targetRack->warehouse?->owner_type !== 'admin') {
                        $validator->errors()->add(
                            'rack_id',
                            'You can only move stock to your own warehouses.'
                        );
                    }
                }

                // Check if quantity exceeds available stock
                if ($stockRecord && $this->quantity > $stockRecord->quantity) {
                    $validator->errors()->add(
                        'quantity',
                        'Cannot move more than available stock ('.$stockRecord->quantity.' units).'
                    );
                }

                // For serialised products, the number of selected serials must equal the quantity.
                $selectedSerials = $this->input('serial_numbers', []);
                if (! empty($selectedSerials) && count($selectedSerials) !== (int) $this->quantity) {
                    $validator->errors()->add(
                        'serial_numbers',
                        'The number of selected serial numbers ('.count($selectedSerials).') must match the quantity to move ('.$this->quantity.').'
                    );
                }

                // If the product has serials in the rack, serials are required.
                if ($stockRecord) {
                    $hasSerials = SerialNumber::where('product_id', $stockRecord->product_id)
                        ->where('rack_id', $stockRecord->rack_id)
                        ->where('status', 'available')
                        ->exists();

                    if ($hasSerials && empty($selectedSerials)) {
                        $validator->errors()->add(
                            'serial_numbers',
                            'This product has serialised units. Please select which serial numbers to move.'
                        );
                    }
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
