<?php

namespace App\Listeners;

use App\Events\TechnicianApplicationRejected;
use App\Notifications\TechnicianApplicationRejectedNotification;

class SendTechnicianApplicationRejectedNotification
{
    public function handle(TechnicianApplicationRejected $event): void
    {
        $event->technician->notify(
            new TechnicianApplicationRejectedNotification($event->technician, $event->rejectionNote)
        );
    }
}
