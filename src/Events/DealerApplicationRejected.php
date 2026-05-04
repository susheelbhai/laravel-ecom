<?php

namespace App\Events;

use App\Models\Dealer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DealerApplicationRejected
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Dealer $dealer,
        public ?string $rejectionNote,
    ) {}
}
