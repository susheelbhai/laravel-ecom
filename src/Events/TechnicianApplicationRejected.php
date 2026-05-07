<?php

namespace App\Events;

use App\Models\Technician;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TechnicianApplicationRejected
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Technician $technician,
        public ?string $rejectionNote,
    ) {}
}
