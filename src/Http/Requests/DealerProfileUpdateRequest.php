<?php

namespace App\Http\Requests;

use App\Models\Dealer;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DealerProfileUpdateRequest extends FormRequest
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
        /** @var Dealer $dealer */
        $dealer = $this->user('dealer');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('dealers', 'email')->ignore($dealer->id)],
            'phone' => ['nullable', 'string', 'max:32', Rule::unique('dealers', 'phone')->ignore($dealer->id)],
            'commission_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
