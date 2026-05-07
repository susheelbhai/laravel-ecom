<?php

namespace Database\Seeders\Production;

use App\Models\DistributorOrderItem;
use App\Models\SerialNumber;
use App\Models\SerialNumberMovement;
use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class SerialNumberMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed stock_in movements for available serial numbers that have no movement yet.
        $serialNumbers = SerialNumber::whereDoesntHave('movements')->take(5)->get();

        foreach ($serialNumbers as $serialNumber) {
            $stockMovement = StockMovement::first();

            SerialNumberMovement::firstOrCreate(
                [
                    'serial_number_id' => $serialNumber->id,
                    'event_type' => 'stock_in',
                ],
                [
                    'reference_type' => $stockMovement ? StockMovement::class : null,
                    'reference_id' => $stockMovement?->id,
                    'actor_type' => null,
                    'actor_id' => null,
                    'from_party' => null,
                    'to_party' => 'admin',
                    'notes' => 'Seeded stock_in movement.',
                    'occurred_at' => now(),
                ]
            );
        }

        // Seed distributor_order movements for serial numbers linked to distributor order items.
        $distributorOrderItems = DistributorOrderItem::has('serialNumbers')->take(3)->get();

        foreach ($distributorOrderItems as $orderItem) {
            foreach ($orderItem->serialNumbers()->take(2)->get() as $serialNumber) {
                SerialNumberMovement::firstOrCreate(
                    [
                        'serial_number_id' => $serialNumber->id,
                        'event_type' => 'distributor_order',
                    ],
                    [
                        'reference_type' => DistributorOrderItem::class,
                        'reference_id' => $orderItem->id,
                        'actor_type' => null,
                        'actor_id' => null,
                        'from_party' => 'admin',
                        'to_party' => 'distributor',
                        'notes' => 'Seeded distributor_order movement.',
                        'occurred_at' => now(),
                    ]
                );
            }
        }
    }
}
