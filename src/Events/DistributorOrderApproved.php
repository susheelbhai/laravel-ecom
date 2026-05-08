<?php

namespace App\Events;

use App\Models\Admin;
use App\Models\DistributorOrder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DistributorOrderApproved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public DistributorOrder $order,
        public Admin $approvedBy,
    ) {}
}
