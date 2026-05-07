<?php

namespace Database\Seeders\Testing;

use App\Models\BrowsingHistory;
use Illuminate\Database\Seeder;

class BrowsingHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        BrowsingHistory::insert($browsing_histories);
    }
}
