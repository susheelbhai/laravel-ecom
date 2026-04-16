<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'full_name',
        'phone',
        'alternate_phone',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'country',
        'pincode',
        'landmark',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the user that owns the address.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full address as a single string.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = [
            $this->address_line1,
            $this->address_line2,
            $this->landmark,
            $this->city,
            $this->state,
            $this->country,
            $this->pincode,
        ];

        return implode(', ', array_filter($parts));
    }
}
