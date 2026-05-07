<?php

namespace Database\Seeders\Production;

use App\Models\WarrantyCard;
use Illuminate\Database\Seeder;

class WarrantyCardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warranty_cards = [];
        include 'data/data.php';
        WarrantyCard::insert($warranty_cards);
    }
}
