<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRecommendationConfigRequest extends FormRequest
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
            'configs' => 'required|array',
            'configs.*.id' => 'required|exists:recommendation_configs,id',
            'configs.*.is_enabled' => 'required|boolean',
            'configs.*.display_order' => 'required|integer|min:0',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'configs.required' => 'Configuration data is required.',
            'configs.*.is_enabled.boolean' => 'Each section must have a valid enabled status.',
            'configs.*.display_order.integer' => 'Display order must be a number.',
        ];
    }
}
