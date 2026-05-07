<?php

namespace Database\Seeders\Testing;

use App\Models\DistributorOrder;
use Illuminate\Database\Seeder;

class DistributorOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        DistributorOrder::insert($distributor_orders);
    }
}
