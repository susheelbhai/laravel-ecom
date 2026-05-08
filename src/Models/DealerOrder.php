<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DealerOrder extends Model
{
    use HasFactory;

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
        'tax_amount',
        'total_amount',
        'payment_status',
        'amount_paid',
    ];

    protected $casts = [
        'subtotal_amount' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
        'amount_paid' => 'float',
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

    public function payments(): HasMany
    {
        return $this->hasMany(DealerOrderPayment::class, 'dealer_order_id');
    }
}
