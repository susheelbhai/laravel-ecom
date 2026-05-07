<?php

namespace App\Http\Requests;

use App\Models\Distributor;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DistributorProfileUpdateRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->phone === '') {
            $this->merge(['phone' => null]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Distributor $distributor */
        $distributor = $this->user('distributor');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('distributors', 'email')->ignore($distributor->id)],
            'phone' => ['nullable', 'string', 'max:32', Rule::unique('distributors', 'phone')->ignore($distributor->id)],
            'commission_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
