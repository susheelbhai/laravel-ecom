<?php

namespace Database\Seeders\Testing;

use App\Models\DealerRetailSaleItem;
use Illuminate\Database\Seeder;

class DealerRetailSaleItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        DealerRetailSaleItem::insert($dealer_retail_sale_items);
    }
}
