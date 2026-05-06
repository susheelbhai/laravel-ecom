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
        $categories = [
            ['title' => 'Electronics', 'slug' => 'electronics', 'description' => 'Electronic devices and gadgets', 'is_active' => true],
            ['title' => 'Clothing', 'slug' => 'clothing', 'description' => 'Fashion and apparel', 'is_active' => true],
            ['title' => 'Home & Garden', 'slug' => 'home-garden', 'description' => 'Home improvement and garden supplies', 'is_active' => true],
            ['title' => 'Sports & Outdoors', 'slug' => 'sports-outdoors', 'description' => 'Sports equipment and outdoor gear', 'is_active' => true],
            ['title' => 'Books', 'slug' => 'books', 'description' => 'Books and literature', 'is_active' => true],
            ['title' => 'Toys & Games', 'slug' => 'toys-games', 'description' => 'Toys and gaming products', 'is_active' => true],
            ['title' => 'Beauty & Health', 'slug' => 'beauty-health', 'description' => 'Beauty and health products', 'is_active' => true],
            ['title' => 'Automotive', 'slug' => 'automotive', 'description' => 'Auto parts and accessories', 'is_active' => true],
        ];

        foreach ($categories as $category) {
            ProductCategory::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
