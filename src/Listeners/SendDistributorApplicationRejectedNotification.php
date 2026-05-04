<?php

namespace App\Listeners;

use App\Events\DistributorApplicationRejected;
use App\Notifications\DistributorApplicationRejectedNotification;

class SendDistributorApplicationRejectedNotification
{
    public function handle(DistributorApplicationRejected $event): void
    {
        $event->distributor->notify(
            new DistributorApplicationRejectedNotification($event->distributor, $event->rejectionNote)
        );
    }
}
