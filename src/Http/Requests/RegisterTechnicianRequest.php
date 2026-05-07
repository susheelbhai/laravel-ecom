<?php

namespace App\Http\Requests;

use App\Models\Technician;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterTechnicianRequest extends FormRequest
{
    /**
     * @return list<string>
     */
    public static function specializations(): array
    {
        return [
            'ac_refrigeration',
            'electrical',
            'plumbing',
            'carpentry',
            'painting',
            'welding',
            'solar_installation',
            'cctv_security',
            'it_networking',
            'other',
        ];
    }

    /**
     * @return list<string>
     */
    public static function idTypes(): array
    {
        return [
            'aadhaar',
            'passport',
            'voter_id',
            'drivers_license',
            'national_id',
            'other',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->phone === '' || $this->phone === null) {
            $this->merge(['phone' => null]);
        }

        foreach ([
            'certification',
            'referral_source',
            'experience_years',
        ] as $key) {
            if ($this->{$key} === '') {
                $this->merge([$key => null]);
            }
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.Technician::class],
            'phone' => ['required', 'string', 'max:32', 'unique:'.Technician::class],
            'password' => ['required', 'confirmed', Password::defaults()],

            'specialization' => ['required', 'string', Rule::in(self::specializations())],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'certification' => ['nullable', 'string', 'max:255'],

            'address' => ['required', 'string', 'max:65535'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'pincode' => ['required', 'string', 'regex:/^[1-9][0-9]{5}$/'],

            'id_type' => ['required', 'string', Rule::in(self::idTypes())],
            'id_number' => ['required', 'string', 'max:64'],

            'referral_source' => ['nullable', 'string', 'max:255'],
        ];
    }
}
