<?php

namespace Database\Seeders\Production;

use App\Models\DealerOrder;
use Illuminate\Database\Seeder;

class DealerOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        DealerOrder::insert($dealer_orders);
    }
}
