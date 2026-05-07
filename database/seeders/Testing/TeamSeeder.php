<?php

namespace Database\Seeders\Testing;

use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        include 'data/data.php';
        Team::insert($team);

    }
}
