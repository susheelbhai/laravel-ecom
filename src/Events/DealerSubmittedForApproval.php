<?php

namespace App\Events;

use App\Models\Dealer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DealerSubmittedForApproval
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Dealer $dealer,
    ) {}
}
