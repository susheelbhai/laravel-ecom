<?php

namespace Database\Seeders\Testing\Laraship;

use Illuminate\Database\Seeder;
use Susheelbhai\Laraship\Models\PickupAddress;

class PickupAddressSeeder extends Seeder
{
    public function run(): void
    {
        // $pickup_addresses = [];
        include __DIR__.'/../data/data.php';
        PickupAddress::insert($pickup_addresses);
    }
}
