<?php

namespace Database\Factories;

use App\Models\Distributor;
use App\Models\DistributorOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DistributorOrder>
 */
class DistributorOrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => DistributorOrder::generateOrderNumber(),
            'status' => DistributorOrder::STATUS_PENDING,
            'distributor_id' => Distributor::factory(),
            'subtotal_amount' => fake()->randomFloat(2, 100, 10000),
            'total_amount' => fake()->randomFloat(2, 100, 10000),
        ];
    }
}
