<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 0;
        $counter++;

        $subtotal = fake()->randomFloat(2, 10, 1000);

        return [
            'user_id' => User::factory(),
            'address_id' => Address::factory(),
            'order_number' => 'ORD-'.time().$counter,
            'subtotal_amount' => $subtotal,
            'discount_amount' => 0,
            'total_amount' => $subtotal,
            'status' => 'pending',
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
