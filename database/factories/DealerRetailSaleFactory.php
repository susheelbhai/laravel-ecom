<?php

namespace Database\Factories;

use App\Models\Dealer;
use App\Models\DealerRetailSale;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DealerRetailSale>
 */
class DealerRetailSaleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dealer = Dealer::factory()->create();

        return [
            'sale_number' => DealerRetailSale::generateSaleNumber(),
            'status' => 'pending',
            'dealer_id' => $dealer->id,
            'created_by_dealer_id' => $dealer->id,
            'subtotal_amount' => fake()->randomFloat(2, 100, 5000),
            'total_amount' => fake()->randomFloat(2, 100, 5000),
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_phone' => fake()->numerify('##########'),
        ];
    }
}
