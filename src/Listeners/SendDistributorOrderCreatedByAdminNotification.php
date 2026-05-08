<?php

namespace App\Listeners;

use App\Events\DistributorOrderCreatedByAdmin;
use App\Notifications\DistributorOrderCreatedByAdminNotificationForDistributor;

class SendDistributorOrderCreatedByAdminNotification
{
    public function handle(DistributorOrderCreatedByAdmin $event): void
    {
        $event->order->loadMissing('distributor');

        $event->order->distributor?->notify(
            new DistributorOrderCreatedByAdminNotificationForDistributor($event->order)
        );
    }
}
