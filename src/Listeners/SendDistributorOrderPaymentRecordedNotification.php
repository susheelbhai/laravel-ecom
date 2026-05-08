<?php

namespace App\Listeners;

use App\Events\DistributorOrderPaymentRecorded;
use App\Notifications\DistributorOrderPaymentRecordedNotificationForDistributor;

class SendDistributorOrderPaymentRecordedNotification
{
    public function handle(DistributorOrderPaymentRecorded $event): void
    {
        $event->order->loadMissing('distributor');

        $event->order->distributor?->notify(
            new DistributorOrderPaymentRecordedNotificationForDistributor(
                $event->order,
                $event->payment,
            )
        );
    }
}
