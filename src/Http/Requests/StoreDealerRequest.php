<?php

namespace App\Http\Requests;

use App\Models\Dealer;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreDealerRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->phone === '' || $this->phone === null) {
            $this->merge(['phone' => null]);
        }
    }

    public function authorize(): bool
    {
        return $this->user('distributor') !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.Dealer::class],
            'phone' => ['nullable', 'string', 'max:32', 'unique:'.Dealer::class],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }
}
