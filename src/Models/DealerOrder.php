<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DealerOrder extends Model
{
    public static function generateOrderNumber(): string
    {
        return 'DLR-'.time().'-'.uniqid();
    }

    protected $fillable = [
        'order_number',
        'status',
        'distributor_id',
        'dealer_id',
        'placed_by_distributor_id',
        'subtotal_amount',
        'total_amount',
    ];

    protected $casts = [
        'subtotal_amount' => 'float',
        'total_amount' => 'float',
    ];

    public function distributor(): BelongsTo
    {
        return $this->belongsTo(Distributor::class);
    }

    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class);
    }

    public function placedByDistributor(): BelongsTo
    {
        return $this->belongsTo(Distributor::class, 'placed_by_distributor_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(DealerOrderItem::class);
    }
}

