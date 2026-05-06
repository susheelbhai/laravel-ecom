<?php

namespace Database\Seeders\Production;

use App\Models\ProductPageBanner;
use Illuminate\Database\Seeder;

class ProductPageBannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include __DIR__.'/data/data.php';
        ProductPageBanner::insert($product_page_banners);
    }
}
