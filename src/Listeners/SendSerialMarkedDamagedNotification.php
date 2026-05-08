<?php

namespace App\Listeners;

use App\Events\SerialMarkedDamaged;
use App\Models\Admin;
use App\Notifications\SerialMarkedDamagedNotificationForAdmin;

class SendSerialMarkedDamagedNotification
{
    public function handle(SerialMarkedDamaged $event): void
    {
        $event->serialNumber->loadMissing('product');

        foreach (Admin::cursor() as $admin) {
            $admin->notify(new SerialMarkedDamagedNotificationForAdmin(
                $event->serialNumber,
                $event->actor,
            ));
        }
    }
}
