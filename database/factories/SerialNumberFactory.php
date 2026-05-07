<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\SerialNumber;
use App\Models\WarehouseRack;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SerialNumber>
 */
class SerialNumberFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'rack_id' => WarehouseRack::factory(),
            'stock_movement_id' => null,
            'serial_number' => fake()->unique()->bothify('SN-####-????'),
            'status' => 'available',
        ];
    }

    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sold',
        ]);
    }

    public function stolen(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'stolen',
        ]);
    }

    public function damaged(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'damaged',
        ]);
    }
}
