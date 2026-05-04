<?php

namespace App\Http\Requests;

use App\Models\Distributor;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterDistributorRequest extends FormRequest
{
    /**
     * @var list<string>
     */
    public static function businessConstitutions(): array
    {
        return [
            'sole_proprietorship',
            'partnership',
            'llp',
            'private_limited',
            'public_limited',
            'opc',
            'trust_society',
            'other',
        ];
    }

    /**
     * @var list<string>
     */
    public static function kycIdTypes(): array
    {
        return [
            'passport',
            'national_id',
            'aadhaar',
            'voter_id',
            'drivers_license',
            'other',
        ];
    }

    /**
     * @var list<string>
     */
    public static function purchaseBands(): array
    {
        return [
            'under_1l',
            '1l_5l',
            '5l_25l',
            '25l_1cr',
            'above_1cr',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->phone === '' || $this->phone === null) {
            $this->merge(['phone' => null]);
        }

        foreach ([
            'trade_name',
            'warehouse_address',
            'tan_number',
            'msme_udyam_number',
            'referral_source',
            'expected_monthly_purchase_band',
            'dob',
        ] as $key) {
            if ($this->{$key} === '') {
                $this->merge([$key => null]);
            }
        }

        if ($this->years_in_business === '' || $this->years_in_business === null) {
            $this->merge(['years_in_business' => null]);
        }

        $this->merge([
            'pan_number' => $this->pan_number ? strtoupper((string) $this->pan_number) : null,
            'gstin' => $this->gstin ? strtoupper(preg_replace('/\s+/', '', (string) $this->gstin)) : null,
            'bank_ifsc' => $this->bank_ifsc ? strtoupper((string) $this->bank_ifsc) : null,
            'tan_number' => $this->tan_number ? strtoupper((string) $this->tan_number) : null,
        ]);
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
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.Distributor::class],
            'phone' => ['required', 'string', 'max:32', 'unique:'.Distributor::class],
            'password' => ['required', 'confirmed', Password::defaults()],

            'legal_business_name' => ['required', 'string', 'max:255'],
            'trade_name' => ['nullable', 'string', 'max:255'],
            'business_constitution' => ['required', 'string', Rule::in(self::businessConstitutions())],
            'authorized_signatory_designation' => ['required', 'string', 'max:128'],

            'kyc_id_type' => ['required', 'string', Rule::in(self::kycIdTypes())],
            'kyc_id_number' => ['required', 'string', 'max:64'],
            'dob' => ['nullable', 'string', 'max:32'],

            'address' => ['required', 'string', 'max:65535'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'pincode' => ['required', 'string', 'regex:/^[1-9][0-9]{5}$/'],
            'warehouse_address' => ['nullable', 'string', 'max:65535'],

            'pan_number' => ['required', 'string', 'regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/'],
            'gstin' => ['required', 'string', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/'],
            'tan_number' => ['nullable', 'string', 'max:20'],
            'msme_udyam_number' => ['nullable', 'string', 'max:32'],
            'nature_of_business' => ['required', 'string', 'max:2000'],
            'years_in_business' => ['nullable', 'integer', 'min:0', 'max:100'],
            'expected_monthly_purchase_band' => ['nullable', 'string', Rule::in(self::purchaseBands())],
            'referral_source' => ['nullable', 'string', 'max:255'],

            'bank_account_holder_name' => ['required', 'string', 'max:255'],
            'bank_name' => ['required', 'string', 'max:255'],
            'bank_branch' => ['required', 'string', 'max:255'],
            'bank_account_number' => ['required', 'string', 'min:5', 'max:34'],
            'bank_ifsc' => ['required', 'string', 'regex:/^[A-Z]{4}0[A-Z0-9]{6}$/'],
        ];
    }
}
