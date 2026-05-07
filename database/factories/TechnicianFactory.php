<?php

namespace Database\Factories;

use App\Models\Technician;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Technician>
 */
class TechnicianFactory extends Factory
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
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->unique()->numerify('##########'),
            'password' => Hash::make('password'),
            'specialization' => fake()->randomElement(['Electrical', 'Mechanical', 'Electronics', 'HVAC']),
            'experience_years' => fake()->numberBetween(1, 20),
            'certification' => null,
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'pincode' => '560001',
            'id_type' => 'national_id',
            'id_number' => fake()->numerify('##########'),
            'referral_source' => null,
            'application_status' => Technician::STATUS_APPROVED,
            'approved_at' => now(),
            'email_verified_at' => now(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_status' => Technician::STATUS_PENDING,
            'approved_at' => null,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_status' => Technician::STATUS_REJECTED,
            'approved_at' => null,
            'rejected_at' => now(),
            'rejection_note' => 'Test rejection',
        ]);
    }
}
