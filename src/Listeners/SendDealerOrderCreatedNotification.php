<?php

namespace App\Listeners;

use App\Events\DealerOrderCreated;
use App\Notifications\DealerOrderCreatedNotificationForDealer;

class SendDealerOrderCreatedNotification
{
    public function handle(DealerOrderCreated $event): void
    {
        $event->order->loadMissing('dealer');

        $event->order->dealer?->notify(
            new DealerOrderCreatedNotificationForDealer($event->order)
        );
    }
}
