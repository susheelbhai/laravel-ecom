<?php

namespace Database\Seeders\Testing;

use App\Models\PromoCode;
use Illuminate\Database\Seeder;

class PromoCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        PromoCode::insert($promo_codes);
    }
}
