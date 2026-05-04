<?php

namespace App\Events;

use App\Models\Admin;
use App\Models\Dealer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DealerApplicationApproved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Dealer $dealer,
        public Admin $approvedBy,
    ) {}
}
