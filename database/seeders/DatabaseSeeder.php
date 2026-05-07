<?php

namespace Database\Seeders;

use Database\Seeders\Production\A_ProductionDatabaseSeeder;
use Database\Seeders\Testing\A_TestingDatabaseSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(A_TestingDatabaseSeeder::class);
        // $this->call(A_ProductionDatabaseSeeder::class);
    }
}
