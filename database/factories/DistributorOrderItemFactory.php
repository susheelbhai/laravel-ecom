<?php

namespace Database\Factories;

use App\Models\DistributorOrder;
use App\Models\DistributorOrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DistributorOrderItem>
 */
class DistributorOrderItemFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 10, 500);
        $quantity = fake()->numberBetween(1, 5);

        return [
            'distributor_order_id' => DistributorOrder::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price' => $price,
            'subtotal' => $price * $quantity,
            'price_source' => 'manual',
        ];
    }
}
