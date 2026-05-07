<?php

namespace Database\Seeders\Production;

use App\Models\RecommendationConfig;
use Illuminate\Database\Seeder;

class RecommendationConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        RecommendationConfig::insert($recommendation_configs);
    }
}
