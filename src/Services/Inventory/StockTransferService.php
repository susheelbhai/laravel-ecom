<?php

namespace App\Services\Inventory;

use App\Contracts\SerialNumberMovementServiceInterface;
use App\Models\DealerOrder;
use App\Models\DistributorOrder;
use App\Models\SerialNumber;
use App\Models\StockMovement;
use App\Models\StockRecord;
use App\Models\WarehouseRack;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class StockTransferService
{
    public function __construct(
        private readonly SerialNumberMovementServiceInterface $serialNumberMovementService,
    ) {}

    /**
     * @param  Collection<int,array{product_id:int,quantity:int}>  $items
     * @param  array<int,string[]>  $serialNumbersByProductId  Map of product_id => serial number strings
     */
    public function transferStock(int $fromRackId, int $toRackId, Collection $items, Model $reference, string $reason, array $serialNumbersByProductId = []): void
    {
        if ($fromRackId === $toRackId) {
            throw new RuntimeException('Source and destination rack cannot be the same.');
        }

        DB::transaction(function () use ($fromRackId, $toRackId, $items, $reference, $reason, $serialNumbersByProductId) {
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

                // Hard guard: if this product has available serials in the source rack
                // but none were provided, refuse the transfer. Run BEFORE any writes.
                $serialsForProduct = $serialNumbersByProductId[$productId] ?? [];

                if (empty($serialsForProduct)) {
                    $serialCount = SerialNumber::where('product_id', $productId)
                        ->where('rack_id', $fromRackId)
                        ->where('status', 'available')
                        ->count();

                    if ($serialCount > 0) {
                        $nonSerialQty = max(0, $available - $serialCount);

                        if ($nonSerialQty > 0) {
                            throw new RuntimeException(
                                "Product {$productId} has {$serialCount} serialised unit(s) and {$nonSerialQty} non-serialised unit(s) in the source rack — ".
                                'mixing is not allowed. Resolve the data inconsistency before transferring.'
                            );
                        }

                        throw new RuntimeException(
                            "Product {$productId} has serialised units in the source rack. ".
                            'You must specify which serial numbers are being transferred.'
                        );
                    }
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

                // Update serial numbers rack_id.
                // Record rack_transfer only for non-order transfers.
                // DistributorOrder and DealerOrder transfers are captured by validateAndAssign.
                $isOrderTransfer = $reference instanceof DistributorOrder
                    || $reference instanceof DealerOrder;

                foreach ($serialsForProduct as $serialString) {
                    $serialRecord = SerialNumber::where('serial_number', $serialString)
                        ->where('product_id', $productId)
                        ->first();

                    if ($serialRecord) {
                        $serialRecord->rack_id = $toRackId;
                        $serialRecord->save();

                        if (! $isOrderTransfer) {
                            $this->serialNumberMovementService->recordMovement(
                                serialNumber: $serialRecord,
                                eventType: 'rack_transfer',
                                reference: $reference,
                                actor: null,
                            );
                        }
                    }
                }
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
