<?php

namespace App\Services\Inventory;

use App\Models\Dealer;
use App\Models\Distributor;
use App\Models\Warehouse;
use App\Models\WarehouseRack;
use Illuminate\Support\Facades\DB;

class DefaultLocationService
{
    public function ensureDistributorDefaultRack(Distributor $distributor): WarehouseRack
    {
        return DB::transaction(function () use ($distributor) {
            $warehouse = Warehouse::query()->firstOrCreate(
                [
                    'owner_type' => 'distributor',
                    'owner_id' => $distributor->id,
                ],
                [
                    'name' => "Distributor-{$distributor->id}",
                    'address' => 'Auto-created distributor warehouse',
                ]
            );

            return WarehouseRack::query()->firstOrCreate(
                [
                    'warehouse_id' => $warehouse->id,
                    'identifier' => 'DEFAULT',
                ],
                [
                    'description' => 'Default distributor rack',
                ]
            );
        });
    }

    public function ensureDealerDefaultRack(Dealer $dealer): WarehouseRack
    {
        return DB::transaction(function () use ($dealer) {
            $warehouse = Warehouse::query()->firstOrCreate(
                [
                    'owner_type' => 'dealer',
                    'owner_id' => $dealer->id,
                ],
                [
                    'name' => "Dealer-{$dealer->id}",
                    'address' => 'Auto-created dealer warehouse',
                ]
            );

            return WarehouseRack::query()->firstOrCreate(
                [
                    'warehouse_id' => $warehouse->id,
                    'identifier' => 'DEFAULT',
                ],
                [
                    'description' => 'Default dealer rack',
                ]
            );
        });
    }
}

