<?php

namespace Database\Seeders\Testing;

use App\Models\BlogView;
use Illuminate\Database\Seeder;

class BlogViewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        BlogView::insert($blog_views);
    }
}
