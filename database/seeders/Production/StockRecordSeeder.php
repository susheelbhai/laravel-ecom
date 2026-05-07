<?php

namespace Database\Seeders\Production;

use App\Models\StockRecord;
use Illuminate\Database\Seeder;

class StockRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        StockRecord::insert($stock_records);
    }
}
