<?php

namespace Database\Factories;

use App\Models\Distributor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Distributor>
 */
class DistributorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'legal_business_name' => fake()->company(),
            'trade_name' => null,
            'business_constitution' => 'private_limited',
            'authorized_signatory_designation' => 'Director',
            'kyc_id_type' => 'national_id',
            'kyc_id_number' => fake()->numerify('##########'),
            'pan_number' => 'ABCDE1234F',
            'gstin' => '22ABCDE1234F1Z5',
            'tan_number' => null,
            'msme_udyam_number' => null,
            'nature_of_business' => 'Product distribution and retail supply',
            'years_in_business' => fake()->numberBetween(1, 20),
            'expected_monthly_purchase_band' => '5l_25l',
            'referral_source' => null,
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->unique()->numerify('##########'),
            'password' => Hash::make('password'),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'pincode' => '560001',
            'warehouse_address' => null,
            'bank_account_holder_name' => fake()->name(),
            'bank_name' => 'HDFC Bank',
            'bank_branch' => fake()->city(),
            'bank_account_number' => fake()->numerify('##########'),
            'bank_ifsc' => 'HDFC0000123',
            'application_status' => Distributor::STATUS_APPROVED,
            'approved_at' => now(),
            'email_verified_at' => now(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_status' => Distributor::STATUS_PENDING,
            'approved_at' => null,
            'approved_by' => null,
            'rejected_at' => null,
            'rejection_note' => null,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_status' => Distributor::STATUS_REJECTED,
            'approved_at' => null,
            'approved_by' => null,
            'rejected_at' => now(),
            'rejection_note' => 'Test rejection',
        ]);
    }
}
