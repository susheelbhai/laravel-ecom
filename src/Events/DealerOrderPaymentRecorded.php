<?php

namespace App\Events;

use App\Models\DealerOrder;
use App\Models\DealerOrderPayment;
use App\Models\Distributor;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DealerOrderPaymentRecorded
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public DealerOrder $order,
        public DealerOrderPayment $payment,
        public Distributor $recordedBy,
    ) {}
}
