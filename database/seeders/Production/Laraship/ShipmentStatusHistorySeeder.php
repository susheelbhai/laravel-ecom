<?php

namespace Database\Seeders\Production\Laraship;

use Illuminate\Database\Seeder;
use Susheelbhai\Laraship\Models\ShipmentStatusHistory;

class ShipmentStatusHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include __DIR__.'/../data/data.php';
        ShipmentStatusHistory::insert($shipment_status_history);
    }
}
