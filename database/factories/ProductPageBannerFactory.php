<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductPageBanner>
 */
class ProductPageBannerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'href' => fake()->url(),
            'target' => fake()->randomElement(['_self', '_blank', '_parent', '_top']),
            'display_order' => fake()->numberBetween(0, 100),
            'is_active' => fake()->boolean(80), // 80% chance of being active
        ];
    }
}
