<?php

namespace Database\Seeders\Production\Laraship;

use Illuminate\Database\Seeder;
use Susheelbhai\Laraship\Models\ShippingProvider;

class ShippingProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include __DIR__.'/../data/data.php';
        ShippingProvider::insert($shipping_providers);
    }
}
