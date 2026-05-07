<?php

namespace Database\Seeders\Testing;

use App\Models\ProductEnquiry;
use Illuminate\Database\Seeder;

class ProductEnquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        $product_enquiries = [];
        ProductEnquiry::insert($product_enquiries);
    }
}
