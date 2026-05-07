<?php

namespace App\Listeners;

use App\Events\TechnicianApplicationApproved;
use App\Notifications\TechnicianApplicationApprovedNotification;

class SendTechnicianApplicationApprovedNotification
{
    public function handle(TechnicianApplicationApproved $event): void
    {
        $event->technician->notify(
            new TechnicianApplicationApprovedNotification($event->technician, $event->approvedBy)
        );
    }
}
