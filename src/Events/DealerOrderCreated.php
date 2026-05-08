<?php

namespace App\Events;

use App\Models\DealerOrder;
use App\Models\Distributor;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DealerOrderCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public DealerOrder $order,
        public Distributor $placedBy,
    ) {}
}
