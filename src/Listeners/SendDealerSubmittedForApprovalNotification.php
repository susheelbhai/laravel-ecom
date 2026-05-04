<?php

namespace App\Listeners;

use App\Events\DealerSubmittedForApproval;
use App\Models\Admin;
use App\Notifications\DealerPendingApprovalNotificationForAdmin;

class SendDealerSubmittedForApprovalNotification
{
    public function handle(DealerSubmittedForApproval $event): void
    {
        foreach (Admin::cursor() as $admin) {
            $admin->notify(new DealerPendingApprovalNotificationForAdmin($event->dealer));
        }
    }
}
