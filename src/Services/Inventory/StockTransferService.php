<?php

namespace App\Services\Inventory;

use App\Models\StockMovement;
use App\Models\StockRecord;
use App\Models\WarehouseRack;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class StockTransferService
{
    /**
     * @param  Collection<int,array{product_id:int,quantity:int}>  $items
     */
    public function transferStock(int $fromRackId, int $toRackId, Collection $items, Model $reference, string $reason): void
    {
        if ($fromRackId === $toRackId) {
            throw new RuntimeException('Source and destination rack cannot be the same.');
        }

        DB::transaction(function () use ($fromRackId, $toRackId, $items, $reference, $reason) {
            WarehouseRack::query()->whereKey([$fromRackId, $toRackId])->lockForUpdate()->get();

            foreach ($items as $item) {
                $productId = (int) $item['product_id'];
                $qty = (int) $item['quantity'];

                if ($qty <= 0) {
                    throw new RuntimeException('Quantity must be at least 1.');
                }

                // Lock the stock record row for this rack+product to avoid race conditions.
                $fromRecord = StockRecord::query()
                    ->where('product_id', $productId)
                    ->where('rack_id', $fromRackId)
                    ->lockForUpdate()
                    ->first();

                $available = $fromRecord?->quantity ?? 0;
                if ($available < $qty) {
                    throw new RuntimeException("Insufficient stock for product {$productId} in source rack. Available: {$available}, Requested: {$qty}");
                }

                StockMovement::create([
                    'product_id' => $productId,
                    'rack_id' => $fromRackId,
                    'type' => 'transfer_out',
                    'quantity' => -$qty,
                    'reason' => $reason,
                    'reference_type' => $reference::class,
                    'reference_id' => $reference->getKey(),
                    'created_by' => null,
                ]);

                StockMovement::create([
                    'product_id' => $productId,
                    'rack_id' => $toRackId,
                    'type' => 'transfer_in',
                    'quantity' => $qty,
                    'reason' => $reason,
                    'reference_type' => $reference::class,
                    'reference_id' => $reference->getKey(),
                    'created_by' => null,
                ]);

                StockRecord::getOrCreateForRack($productId, $fromRackId)->recalculateQuantity();
                StockRecord::getOrCreateForRack($productId, $toRackId)->recalculateQuantity();
            }
        });
    }

    /**
     * @param  Collection<int,array{product_id:int,quantity:int}>  $items
     */
    public function consumeStock(int $rackId, Collection $items, Model $reference, string $reason): void
    {
        DB::transaction(function () use ($rackId, $items, $reference, $reason) {
            WarehouseRack::query()->whereKey($rackId)->lockForUpdate()->firstOrFail();

            foreach ($items as $item) {
                $productId = (int) $item['product_id'];
                $qty = (int) $item['quantity'];

                if ($qty <= 0) {
                    throw new RuntimeException('Quantity must be at least 1.');
                }

                $record = StockRecord::query()
                    ->where('product_id', $productId)
                    ->where('rack_id', $rackId)
                    ->lockForUpdate()
                    ->first();

                $available = $record?->quantity ?? 0;
                if ($available < $qty) {
                    throw new RuntimeException("Insufficient stock for product {$productId}. Available: {$available}, Requested: {$qty}");
                }

                StockMovement::create([
                    'product_id' => $productId,
                    'rack_id' => $rackId,
                    'type' => 'out',
                    'quantity' => $qty,
                    'reason' => $reason,
                    'reference_type' => $reference::class,
                    'reference_id' => $reference->getKey(),
                    'created_by' => null,
                ]);

                StockRecord::getOrCreateForRack($productId, $rackId)->recalculateQuantity();
            }
        });
    }
}

