<?php

namespace Database\Seeders\Production;

use App\Models\ProductEnquiry;
use Illuminate\Database\Seeder;

class ProductEnquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include __DIR__.'/data/data.php';
        if (isset($product_enquiries) && is_array($product_enquiries)) {
            ProductEnquiry::insert($product_enquiries);
        }
    }
}
