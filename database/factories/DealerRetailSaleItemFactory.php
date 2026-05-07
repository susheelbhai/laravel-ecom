<?php

namespace Database\Factories;

use App\Models\DealerRetailSale;
use App\Models\DealerRetailSaleItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DealerRetailSaleItem>
 */
class DealerRetailSaleItemFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 10, 500);

        return [
            'dealer_retail_sale_id' => DealerRetailSale::factory(),
            'product_id' => Product::factory(),
            'quantity' => 1,
            'unit_price' => $price,
            'subtotal' => $price,
            'serial_number_id' => null,
        ];
    }
}
