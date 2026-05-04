<?php

namespace App\Listeners;

use App\Events\DistributorRegistered;
use App\Models\Admin;
use App\Notifications\DistributorRegisteredNotificationForAdmin;

class SendDistributorRegisteredNotification
{
    public function handle(DistributorRegistered $event): void
    {
        foreach (Admin::cursor() as $admin) {
            $admin->notify(new DistributorRegisteredNotificationForAdmin($event->distributor));
        }
    }
}
