<?php

namespace App\Http\Requests;

use App\Models\Technician;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TechnicianProfileUpdateRequest extends FormRequest
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
        /** @var Technician $technician */
        $technician = $this->user('technician');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('technicians', 'email')->ignore($technician->id)],
            'phone' => ['nullable', 'string', 'max:32', Rule::unique('technicians', 'phone')->ignore($technician->id)],
        ];
    }
}
