<?php

namespace App\Listeners;

use App\Events\ShipmentBooked;
use App\Notifications\ShipmentBookedNotificationForUser;

class SendShipmentBookedNotification
{
    public function handle(ShipmentBooked $event): void
    {
        $event->order->loadMissing('user');

        $event->order->user?->notify(
            new ShipmentBookedNotificationForUser($event->order, $event->trackingNumber)
        );
    }
}
