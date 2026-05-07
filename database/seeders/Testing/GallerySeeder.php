<?php

namespace Database\Seeders\Testing;

use App\Models\Gallery;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $galleries = [];
        include 'data/data.php';
        Gallery::insert($galleries);
    }
}
