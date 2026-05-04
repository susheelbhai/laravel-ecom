<?php

namespace App\Listeners;

use App\Events\DistributorApplicationApproved;
use App\Notifications\DistributorApplicationApprovedNotification;

class SendDistributorApplicationApprovedNotification
{
    public function handle(DistributorApplicationApproved $event): void
    {
        $event->distributor->notify(
            new DistributorApplicationApprovedNotification($event->distributor, $event->approvedBy)
        );
    }
}
