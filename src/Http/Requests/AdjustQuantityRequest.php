<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AdjustQuantityRequest extends FormRequest
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
            'adjustment' => ['required', 'integer'],
            'reason' => ['nullable', 'string', 'max:500'],
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

                if ($stockRecord) {
                    $newQuantity = $stockRecord->quantity + $this->adjustment;

                    if ($newQuantity < 0) {
                        $validator->errors()->add(
                            'adjustment',
                            "This adjustment would result in negative quantity. Current: {$stockRecord->quantity}, Adjustment: {$this->adjustment}."
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
            'adjustment.required' => 'Adjustment value is required.',
            'adjustment.integer' => 'Adjustment must be a whole number.',
            'reason.max' => 'Reason cannot exceed 500 characters.',
        ];
    }
}
