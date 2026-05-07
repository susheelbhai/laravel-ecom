<?php

namespace App\Contracts;

use App\Models\DealerRetailSaleItem;
use App\Models\SerialNumber;
use App\Models\SerialNumberMovement;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

interface SerialNumberMovementServiceInterface
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
    ): SerialNumberMovement;

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
    ): void;

    /**
     * Validate a single serial number for a retail sale item, mark it sold,
     * link it to the sale item, and record the movement.
     */
    public function validateAndConsume(
        string $serialNumber,
        int $productId,
        DealerRetailSaleItem $saleItem,
        ?Model $actor = null
    ): SerialNumber;

    /**
     * Mark a serial number as stolen, record the movement with notes,
     * and prevent any further transfers.
     */
    public function markStolen(
        SerialNumber $serialNumber,
        ?Model $actor = null,
        ?string $notes = null
    ): SerialNumberMovement;

    /**
     * Mark a serial number as damaged/scrapped, record the movement with notes,
     * and prevent any further transfers.
     */
    public function markDamaged(
        SerialNumber $serialNumber,
        ?Model $actor = null,
        ?string $notes = null
    ): SerialNumberMovement;
}
