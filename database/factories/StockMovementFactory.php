<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => \App\Models\Product::factory(),
            'rack_id' => \App\Models\WarehouseRack::factory(),
            'type' => fake()->randomElement(['in', 'out', 'adjustment']),
            'quantity' => fake()->numberBetween(1, 100),
            'reason' => fake()->sentence(),
            'created_by' => \App\Models\Admin::factory(),
        ];
    }

    public function incoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'in',
        ]);
    }

    public function outgoing(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'out',
        ]);
    }

    public function adjustment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'adjustment',
        ]);
    }
}
