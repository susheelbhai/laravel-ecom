<?php

namespace App\Events;

use App\Models\Admin;
use App\Models\Distributor;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DistributorApplicationApproved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Distributor $distributor,
        public Admin $approvedBy,
    ) {}
}
