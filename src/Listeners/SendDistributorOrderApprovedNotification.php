<?php

namespace App\Listeners;

use App\Events\DistributorOrderApproved;
use App\Notifications\DistributorOrderApprovedNotificationForDistributor;

class SendDistributorOrderApprovedNotification
{
    public function handle(DistributorOrderApproved $event): void
    {
        $event->order->loadMissing('distributor');

        $event->order->distributor?->notify(
            new DistributorOrderApprovedNotificationForDistributor($event->order)
        );
    }
}
