<?php

namespace Database\Seeders\Production;

use App\Models\ProductWarranty;
use Illuminate\Database\Seeder;

class ProductWarrantySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product_warranties = [];
        include 'data/data.php';
        ProductWarranty::insert($product_warranties);
    }
}
