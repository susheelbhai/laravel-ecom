<?php

namespace Database\Seeders\Production;

use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class StockMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        StockMovement::insert($stock_movements);
    }
}
