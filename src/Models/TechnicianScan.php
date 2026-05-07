<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnicianScan extends Model
{
    protected $fillable = [
        'technician_id',
        'serial_number_id',
        'scanned_at',
        'location',
        'notes',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    public function technician(): BelongsTo
    {
        return $this->belongsTo(Technician::class);
    }

    public function serialNumber(): BelongsTo
    {
        return $this->belongsTo(SerialNumber::class);
    }
}
