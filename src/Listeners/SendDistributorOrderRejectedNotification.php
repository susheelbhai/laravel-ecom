<?php

namespace App\Listeners;

use App\Events\DistributorOrderRejected;
use App\Notifications\DistributorOrderRejectedNotificationForDistributor;

class SendDistributorOrderRejectedNotification
{
    public function handle(DistributorOrderRejected $event): void
    {
        $event->order->loadMissing('distributor');

        $event->order->distributor?->notify(
            new DistributorOrderRejectedNotificationForDistributor(
                $event->order,
                $event->order->rejection_note,
            )
        );
    }
}
