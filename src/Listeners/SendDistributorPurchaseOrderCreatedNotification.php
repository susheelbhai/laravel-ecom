<?php

namespace App\Listeners;

use App\Events\DistributorPurchaseOrderCreated;
use App\Models\Admin;
use App\Notifications\DistributorPurchaseOrderCreatedNotificationForAdmin;

class SendDistributorPurchaseOrderCreatedNotification
{
    public function handle(DistributorPurchaseOrderCreated $event): void
    {
        foreach (Admin::cursor() as $admin) {
            $admin->notify(new DistributorPurchaseOrderCreatedNotificationForAdmin($event->order));
        }
    }
}
