<?php

namespace Database\Seeders\Testing;

use App\Models\RecommendationConfig;
use Illuminate\Database\Seeder;

class RecommendationConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include __DIR__.'/data/data.php';
        RecommendationConfig::insert($recommendation_configs);
    }
}
