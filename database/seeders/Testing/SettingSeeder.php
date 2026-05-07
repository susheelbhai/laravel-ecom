<?php

namespace Database\Seeders\Testing;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        include 'data/data.php';
        Setting::insert($settings);
    }
}
