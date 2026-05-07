<?php

namespace Database\Seeders\Production;

use App\Models\DealerOrderItem;
use Illuminate\Database\Seeder;

class DealerOrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        DealerOrderItem::insert($dealer_order_items);
    }
}
