<?php

namespace Database\Seeders\Production;

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
