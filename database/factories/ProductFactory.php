<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_category_id' => \App\Models\ProductCategory::factory(),
            'title' => fake()->sentence(3),
            'slug' => fake()->unique()->slug(),
            'sku' => fake()->unique()->ean8(),
            'short_description' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'is_active' => true,
        ];
    }
}
