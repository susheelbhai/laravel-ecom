<?php

namespace App\Listeners;

use App\Events\OrderPlaced;

class ReduceStockOnOrderPlaced
{
    /**
     * Handle the event.
     *
     * Note: Stock reduction now happens in ConfirmOrder action for immediate orders (COD).
     * This listener only handles stock reduction for delayed payment orders (online payment)
     * when the payment is confirmed and completeOrder() is called.
     */
    public function handle(OrderPlaced $event): void
    {
        // Stock reduction is now handled in ConfirmOrder action
        // This prevents race conditions by using pessimistic locking within the transaction
        //
        // This listener is kept for backward compatibility and logging purposes
        // but the actual stock reduction happens before the event is dispatched
    }
}
