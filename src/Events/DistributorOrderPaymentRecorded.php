<?php

namespace App\Events;

use App\Models\Admin;
use App\Models\DistributorOrder;
use App\Models\DistributorOrderPayment;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DistributorOrderPaymentRecorded
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public DistributorOrder $order,
        public DistributorOrderPayment $payment,
        public Admin $recordedBy,
    ) {}
}
