<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PromoCode>
 */
class PromoCodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $discountType = $this->faker->randomElement(['percentage', 'fixed']);

        return [
            'code' => strtoupper($this->faker->unique()->bothify('???###')),
            'description' => $this->faker->sentence(),
            'discount_type' => $discountType,
            'discount_value' => $discountType === 'percentage'
                ? $this->faker->numberBetween(5, 50)
                : $this->faker->randomFloat(2, 50, 500),
            'min_order_amount' => $this->faker->optional(0.7)->randomFloat(2, 100, 1000),
            'max_discount_amount' => $discountType === 'percentage'
                ? $this->faker->optional(0.5)->randomFloat(2, 100, 500)
                : null,
            'usage_limit' => $this->faker->optional(0.6)->numberBetween(10, 1000),
            'usage_count' => 0,
            'per_user_limit' => $this->faker->optional(0.7)->numberBetween(1, 5),
            'partner_id' => null,
            'is_active' => true,
            'valid_from' => now(),
            'valid_until' => $this->faker->optional(0.8)->dateTimeBetween('now', '+6 months'),
        ];
    }

    public function withPartner(): static
    {
        return $this->state(fn (array $attributes) => [
            'partner_id' => \App\Models\Partner::factory(),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'valid_until' => now()->subDays(1),
        ]);
    }
}
