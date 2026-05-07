<?php

namespace Database\Seeders\Production;

use App\Models\SerialNumber;
use App\Models\Technician;
use App\Models\TechnicianScan;
use Illuminate\Database\Seeder;

class TechnicianScanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $technicians = Technician::take(3)->get();
        $serialNumbers = SerialNumber::take(5)->get();

        if ($technicians->isEmpty() || $serialNumbers->isEmpty()) {
            return;
        }

        $locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'];

        foreach ($serialNumbers as $index => $serialNumber) {
            $technician = $technicians[$index % $technicians->count()];

            TechnicianScan::firstOrCreate(
                [
                    'technician_id' => $technician->id,
                    'serial_number_id' => $serialNumber->id,
                ],
                [
                    'scanned_at' => now()->subDays($index),
                    'location' => $locations[$index % count($locations)],
                    'notes' => 'Seeded scan record.',
                ]
            );
        }
    }
}
