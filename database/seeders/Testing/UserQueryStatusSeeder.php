<?php

namespace Database\Seeders\Testing;

use App\Models\UserQueryStatus;
use Illuminate\Database\Seeder;

class UserQueryStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        UserQueryStatus::insert($user_query_statuses);
    }
}
