<?php

namespace App\Listeners;

use App\Events\DealerOrderPaymentRecorded;
use App\Notifications\DealerOrderPaymentRecordedNotificationForDealer;

class SendDealerOrderPaymentRecordedNotification
{
    public function handle(DealerOrderPaymentRecorded $event): void
    {
        $event->order->loadMissing('dealer');

        $event->order->dealer?->notify(
            new DealerOrderPaymentRecordedNotificationForDealer(
                $event->order,
                $event->payment,
            )
        );
    }
}
