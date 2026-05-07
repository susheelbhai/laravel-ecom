<?php

namespace Database\Factories;

use App\Models\Dealer;
use App\Models\DealerOrder;
use App\Models\Distributor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DealerOrder>
 */
class DealerOrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $distributor = Distributor::factory()->create();

        return [
            'order_number' => DealerOrder::generateOrderNumber(),
            'status' => 'pending',
            'distributor_id' => $distributor->id,
            'dealer_id' => Dealer::factory()->create(['distributor_id' => $distributor->id])->id,
            'subtotal_amount' => fake()->randomFloat(2, 100, 10000),
            'total_amount' => fake()->randomFloat(2, 100, 10000),
        ];
    }
}
