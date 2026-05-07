<?php

namespace Database\Seeders\Testing;

use App\Models\DistributorOrderItem;
use Illuminate\Database\Seeder;

class DistributorOrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        DistributorOrderItem::insert($distributor_order_items);
    }
}
