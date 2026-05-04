<?php

namespace App\Listeners;

use App\Events\DealerApplicationRejected;
use App\Notifications\DealerApplicationRejectedNotification;
use App\Notifications\DealerApplicationRejectedNotificationForDistributor;

class SendDealerApplicationRejectedNotification
{
    public function handle(DealerApplicationRejected $event): void
    {
        $event->dealer->loadMissing('distributor');

        $event->dealer->notify(
            new DealerApplicationRejectedNotification($event->dealer, $event->rejectionNote)
        );

        if ($event->dealer->distributor) {
            $event->dealer->distributor->notify(
                new DealerApplicationRejectedNotificationForDistributor($event->dealer, $event->rejectionNote)
            );
        }
    }
}
