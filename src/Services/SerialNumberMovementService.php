<?php

namespace App\Services;

use App\Contracts\SerialNumberMovementServiceInterface;
use App\Models\DealerOrderItem;
use App\Models\DealerRetailSaleItem;
use App\Models\DistributorOrderItem;
use App\Models\SerialNumber;
use App\Models\SerialNumberMovement;
use App\Models\StockMovement;
use App\Models\StockRecord;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SerialNumberMovementService implements SerialNumberMovementServiceInterface
{
    /**
     * Record a movement event for a serial number.
     */
    public function recordMovement(
        SerialNumber $serialNumber,
        string $eventType,
        ?Model $reference = null,
        ?Model $actor = null,
        ?Carbon $occurredAt = null,
        ?string $notes = null
    ): SerialNumberMovement {
        return SerialNumberMovement::create([
            'serial_number_id' => $serialNumber->id,
            'event_type' => $eventType,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id' => $reference?->id,
            'actor_type' => $actor ? get_class($actor) : null,
            'actor_id' => $actor?->id,
            'notes' => $notes,
            'occurred_at' => $occurredAt ?? now(),
        ]);
    }

    /**
     * Validate that all given serial numbers are available and belong to the correct product,
     * then attach them to the given order item and record movements.
     *
     * @param  string[]  $serialNumbers
     */
    public function validateAndAssign(
        array $serialNumbers,
        int $productId,
        Model $orderItem,
        string $eventType,
        ?Model $actor = null
    ): void {
        if (count($serialNumbers) !== $orderItem->quantity) {
            throw ValidationException::withMessages([
                'serial_numbers' => [
                    sprintf(
                        'Expected %d serial number(s) but received %d.',
                        $orderItem->quantity,
                        count($serialNumbers)
                    ),
                ],
            ]);
        }

        DB::transaction(function () use ($serialNumbers, $productId, $orderItem, $eventType, $actor) {
            foreach ($serialNumbers as $serialNumberString) {
                $record = SerialNumber::where('serial_number', $serialNumberString)
                    ->lockForUpdate()
                    ->first();

                if (! $record || $record->product_id !== $productId) {
                    throw ValidationException::withMessages([
                        'serial_numbers' => [
                            sprintf(
                                'Serial number "%s" not found or does not belong to this product.',
                                $serialNumberString
                            ),
                        ],
                    ]);
                }

                if ($record->status !== 'available') {
                    throw ValidationException::withMessages([
                        'serial_numbers' => [
                            sprintf(
                                'Serial number "%s" is not available (status: %s).',
                                $serialNumberString,
                                $record->status
                            ),
                        ],
                    ]);
                }

                $orderItem->serialNumbers()->attach($record->id);

                SerialNumberMovement::create([
                    'serial_number_id' => $record->id,
                    'event_type' => $eventType,
                    'reference_type' => get_class($orderItem),
                    'reference_id' => $orderItem->id,
                    'actor_type' => $actor ? get_class($actor) : null,
                    'actor_id' => $actor?->id,
                    'to_party' => $this->resolveToParty($orderItem),
                    'occurred_at' => now(),
                ]);
            }
        });
    }

    /**
     * Validate a single serial number for a retail sale item, mark it sold,
     * link it to the sale item, and record the movement.
     */
    public function validateAndConsume(
        string $serialNumber,
        int $productId,
        DealerRetailSaleItem $saleItem,
        ?Model $actor = null
    ): SerialNumber {
        return DB::transaction(function () use ($serialNumber, $productId, $saleItem, $actor) {
            $record = SerialNumber::where('serial_number', $serialNumber)
                ->lockForUpdate()
                ->first();

            if (! $record || $record->product_id !== $productId) {
                throw ValidationException::withMessages([
                    'serial_number' => [
                        sprintf(
                            'Serial number "%s" not found or does not belong to this product.',
                            $serialNumber
                        ),
                    ],
                ]);
            }

            if ($record->status !== 'available') {
                throw ValidationException::withMessages([
                    'serial_number' => [
                        sprintf(
                            'Serial number "%s" is not available (status: %s).',
                            $serialNumber,
                            $record->status
                        ),
                    ],
                ]);
            }

            $record->status = 'sold';
            $record->save();

            $saleItem->serial_number_id = $record->id;
            $saleItem->save();

            $this->recordMovement(
                serialNumber: $record,
                eventType: 'retail_sale',
                reference: $saleItem,
                actor: $actor,
            );

            return $record;
        });
    }

    /**
     * Mark a serial number as stolen, record the movement with notes,
     * and prevent any further transfers.
     */
    public function markStolen(
        SerialNumber $serialNumber,
        ?Model $actor = null,
        ?string $notes = null
    ): SerialNumberMovement {
        return DB::transaction(function () use ($serialNumber, $actor, $notes) {
            $record = SerialNumber::where('id', $serialNumber->id)
                ->lockForUpdate()
                ->first();

            if ($record->status === 'stolen') {
                throw ValidationException::withMessages([
                    'serial_number' => ['Serial number is already marked as stolen.'],
                ]);
            }

            $record->status = 'stolen';
            $record->save();

            // Deduct from stock — stolen unit is removed from circulation.
            StockMovement::create([
                'product_id' => $record->product_id,
                'rack_id' => $record->rack_id,
                'type' => 'out',
                'quantity' => 1,
                'reason' => 'Marked as stolen'.($notes ? ": {$notes}" : ''),
                'reference_type' => SerialNumber::class,
                'reference_id' => $record->id,
                'created_by' => $actor?->getKey(),
            ]);

            StockRecord::getOrCreateForRack($record->product_id, $record->rack_id)
                ->recalculateQuantity();

            $movement = $this->recordMovement(
                serialNumber: $record,
                eventType: 'stolen',
                reference: null,
                actor: $actor,
                occurredAt: now(),
                notes: $notes,
            );

            return $movement;
        });
    }

    /**
     * Mark a serial number as damaged/scrapped, record the movement with notes,
     * and prevent any further transfers.
     */
    public function markDamaged(
        SerialNumber $serialNumber,
        ?Model $actor = null,
        ?string $notes = null
    ): SerialNumberMovement {
        return DB::transaction(function () use ($serialNumber, $actor, $notes) {
            $record = SerialNumber::where('id', $serialNumber->id)
                ->lockForUpdate()
                ->first();

            if ($record->status !== 'available') {
                throw ValidationException::withMessages([
                    'serial_number' => [
                        sprintf(
                            'Only available serial numbers can be marked as damaged (current status: %s).',
                            $record->status
                        ),
                    ],
                ]);
            }

            $record->status = 'damaged';
            $record->save();

            // Deduct from stock — damaged unit is removed from circulation.
            StockMovement::create([
                'product_id' => $record->product_id,
                'rack_id' => $record->rack_id,
                'type' => 'out',
                'quantity' => 1,
                'reason' => 'Marked as damaged'.($notes ? ": {$notes}" : ''),
                'reference_type' => SerialNumber::class,
                'reference_id' => $record->id,
                'created_by' => $actor?->getKey(),
            ]);

            StockRecord::getOrCreateForRack($record->product_id, $record->rack_id)
                ->recalculateQuantity();

            $movement = $this->recordMovement(
                serialNumber: $record,
                eventType: 'damaged',
                reference: null,
                actor: $actor,
                occurredAt: now(),
                notes: $notes,
            );

            return $movement;
        });
    }

    /**
     * Resolve the human-readable to_party string based on the order item type.
     */
    private function resolveToParty(Model $orderItem): string
    {
        if ($orderItem instanceof DistributorOrderItem) {
            return 'Distributor';
        }

        if ($orderItem instanceof DealerOrderItem) {
            return 'Dealer';
        }

        return get_class($orderItem);
    }
}
