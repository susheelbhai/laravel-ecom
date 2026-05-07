<?php

namespace Database\Seeders\Testing;

use App\Models\FaqCategory;
use Illuminate\Database\Seeder;

class FaqCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        FaqCategory::insert($faq_categories);
    }
}
