<?php

namespace App\Events;

use App\Models\Admin;
use App\Models\Technician;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TechnicianApplicationApproved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Technician $technician,
        public Admin $approvedBy,
    ) {}
}
