<?php

namespace Database\Seeders\Testing;

use App\Models\Visitor;
use Illuminate\Database\Seeder;

class VisitorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        Visitor::insert($visitors);
    }
}
