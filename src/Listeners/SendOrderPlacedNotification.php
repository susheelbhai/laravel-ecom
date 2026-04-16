<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Models\Admin;
use App\Notifications\OrderPlacedNotificationForAdmin;
use App\Notifications\OrderPlacedNotificationForUser;

class SendOrderPlacedNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    public function handle(OrderPlaced $event): void
    {
        $admin = Admin::first();
        $admin->notify(new OrderPlacedNotificationForAdmin($event));
        $event->order->user->notify(new OrderPlacedNotificationForUser($event));
    }
}
