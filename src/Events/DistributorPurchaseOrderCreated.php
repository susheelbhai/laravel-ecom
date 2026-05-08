<?php

namespace App\Events;

use App\Models\Distributor;
use App\Models\DistributorOrder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DistributorPurchaseOrderCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public DistributorOrder $order,
        public Distributor $distributor,
    ) {}
}
