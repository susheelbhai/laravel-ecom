<?php

namespace App\Listeners;

use App\Events\TechnicianRegistered;
use App\Models\Admin;
use App\Notifications\TechnicianRegisteredNotificationForAdmin;

class SendTechnicianRegisteredNotification
{
    public function handle(TechnicianRegistered $event): void
    {
        foreach (Admin::cursor() as $admin) {
            $admin->notify(new TechnicianRegisteredNotificationForAdmin($event->technician));
        }
    }
}
