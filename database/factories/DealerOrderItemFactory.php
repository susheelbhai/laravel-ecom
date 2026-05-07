<?php

namespace Database\Factories;

use App\Models\DealerOrder;
use App\Models\DealerOrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DealerOrderItem>
 */
class DealerOrderItemFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 10, 500);
        $quantity = fake()->numberBetween(1, 5);

        return [
            'dealer_order_id' => DealerOrder::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price' => $price,
            'subtotal' => $price * $quantity,
            'price_source' => 'manual',
        ];
    }
}
