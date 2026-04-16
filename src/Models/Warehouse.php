<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'country',
        'pincode',
    ];

    public function racks(): HasMany
    {
        return $this->hasMany(WarehouseRack::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the full address as a single string.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = [
            $this->address_line1 ?: $this->address,
            $this->address_line2,
            $this->city,
            $this->state,
            $this->country,
            $this->pincode,
        ];

        return implode(', ', array_filter($parts));
    }
}
