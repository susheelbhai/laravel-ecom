<?php

namespace Database\Seeders;

use App\Models\ImportantLink;
use Illuminate\Database\Seeder;

class ImportantLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        include 'data/data.php';
        ImportantLink::insert($important_links);
    }
}
