<?php

namespace App\Listeners;

use App\Events\DealerApplicationApproved;
use App\Notifications\DealerApplicationApprovedNotification;
use App\Notifications\DealerApplicationApprovedNotificationForDistributor;

class SendDealerApplicationApprovedNotification
{
    public function handle(DealerApplicationApproved $event): void
    {
        $event->dealer->loadMissing('distributor');

        $event->dealer->notify(
            new DealerApplicationApprovedNotification($event->dealer, $event->approvedBy)
        );

        if ($event->dealer->distributor) {
            $event->dealer->distributor->notify(
                new DealerApplicationApprovedNotificationForDistributor($event->dealer)
            );
        }
    }
}
