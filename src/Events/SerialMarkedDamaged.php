<?php

namespace App\Events;

use App\Models\SerialNumber;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SerialMarkedDamaged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public SerialNumber $serialNumber,
        public object $actor,
    ) {}
}
