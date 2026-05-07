<?php

namespace Database\Seeders\Production;

use App\Models\DealerRetailSale;
use Illuminate\Database\Seeder;

class DealerRetailSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        DealerRetailSale::insert($dealer_retail_sales);
    }
}
