<?php

namespace Database\Seeders\Production;

use App\Models\Slider1;
use Illuminate\Database\Seeder;

class Slider1Seeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        include 'data/data.php';
        Slider1::insert($slider1);
    }
}
