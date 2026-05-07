<?php

namespace Database\Seeders\Testing;

use App\Models\SerialNumber;
use Illuminate\Database\Seeder;

class SerialNumberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $serial_numbers = [];
        include 'data/data.php';
        SerialNumber::insert($serial_numbers);
    }
}
