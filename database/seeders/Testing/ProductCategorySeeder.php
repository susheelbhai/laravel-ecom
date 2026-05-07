<?php

namespace Database\Seeders\Testing;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        ProductCategory::insert($product_categories);
    }
}
