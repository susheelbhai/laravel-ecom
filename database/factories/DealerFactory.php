<?php

namespace Database\Factories;

use App\Models\Dealer;
use App\Models\Distributor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Dealer>
 */
class DealerFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'distributor_id' => Distributor::factory(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->unique()->numerify('##########'),
            'password' => Hash::make('password'),
            'application_status' => Dealer::STATUS_APPROVED,
            'approved_at' => now(),
            'email_verified_at' => now(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_status' => Dealer::STATUS_PENDING,
            'approved_at' => null,
            'approved_by' => null,
            'rejected_at' => null,
            'rejection_note' => null,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_status' => Dealer::STATUS_REJECTED,
            'approved_at' => null,
            'approved_by' => null,
            'rejected_at' => now(),
            'rejection_note' => 'Test rejection',
        ]);
    }
}
