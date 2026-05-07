<?php

namespace App\Http\Requests;

use App\Models\SerialNumber;
use App\Models\StockRecord;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreStockRecordRequest extends FormRequest
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
            'product_id' => ['required', 'exists:products,id'],
            'rack_id' => ['required', 'exists:warehouse_racks,id'],
            'quantity' => ['required', 'integer', 'min:0', 'max:100'],
            'serial_numbers' => ['nullable', 'array'],
            'serial_numbers.*' => ['required', 'string', 'max:100', 'distinct', 'unique:serial_numbers,serial_number'],
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
            'product_id.required' => 'Product is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'rack_id.required' => 'Rack is required.',
            'rack_id.exists' => 'The selected rack does not exist.',
            'quantity.required' => 'Quantity is required.',
            'quantity.integer' => 'Quantity must be a whole number.',
            'quantity.min' => 'Quantity cannot be negative.',
            'quantity.max' => 'You cannot add more than 100 units at a time.',
            'serial_numbers.array' => 'Serial numbers must be a list.',
            'serial_numbers.*.required' => 'Serial number value is required.',
            'serial_numbers.*.distinct' => 'Duplicate serial numbers are not allowed.',
            'serial_numbers.*.unique' => 'Serial number :input already exists in the system.',
        ];
    }

    /**
     * Additional validation after the main rules pass.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            $serials = $this->input('serial_numbers', []);
            $quantity = (int) $this->input('quantity', 0);
            $productId = (int) $this->input('product_id', 0);
            $rackId = (int) $this->input('rack_id', 0);

            // Serial count must match quantity when serials are provided.
            if (! empty($serials) && count($serials) !== $quantity) {
                $v->errors()->add(
                    'serial_numbers',
                    'The number of serial numbers ('.count($serials).') must match the quantity ('.$quantity.').'
                );

                return; // No point running further checks.
            }

            if ($productId && $rackId) {
                // Only count serials that are currently available (in stock).
                // Sold/stolen/damaged serials are historical and don't affect the current rack state.
                $existingSerialCount = SerialNumber::where('product_id', $productId)
                    ->where('rack_id', $rackId)
                    ->where('status', 'available')
                    ->count();

                $existingNonSerialQty = StockRecord::where('product_id', $productId)
                    ->where('rack_id', $rackId)
                    ->value('quantity') ?? 0;

                $existingNonSerialQty = max(0, $existingNonSerialQty - $existingSerialCount);

                // If the rack already has serialised units, new entries must also have serials.
                if ($existingSerialCount > 0 && empty($serials)) {
                    $v->errors()->add(
                        'serial_numbers',
                        "This product already has {$existingSerialCount} serialised unit(s) in this rack. ".
                        'All units of a serialised product must have serial numbers — please provide serial numbers for the new units.'
                    );
                }

                // If the rack already has non-serialised units, new entries must NOT add serials
                // (mixing is not allowed).
                if ($existingNonSerialQty > 0 && ! empty($serials)) {
                    $v->errors()->add(
                        'serial_numbers',
                        "This product already has {$existingNonSerialQty} non-serialised unit(s) in this rack. ".
                        'You cannot mix serialised and non-serialised units of the same product in the same rack. '.
                        'Move or remove the existing non-serialised stock first.'
                    );
                }
            }
        });
    }
}
