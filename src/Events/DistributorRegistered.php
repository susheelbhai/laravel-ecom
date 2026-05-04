<?php

namespace App\Events;

use App\Models\Distributor;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DistributorRegistered
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Distributor $distributor,
    ) {}
}
