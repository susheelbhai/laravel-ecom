<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DealerRetailSale extends Model
{
    public static function generateSaleNumber(): string
    {
        return 'SALE-'.time().'-'.uniqid();
    }

    protected $fillable = [
        'sale_number',
        'status',
        'dealer_id',
        'created_by_dealer_id',
        'subtotal_amount',
        'total_amount',
        'customer_name',
        'customer_email',
        'customer_phone',
        'billing_address_line1',
        'billing_address_line2',
        'billing_city',
        'billing_state',
        'billing_pincode',
        'billing_country',
        'customer_gstin',
    ];

    protected $casts = [
        'subtotal_amount' => 'float',
        'total_amount' => 'float',
    ];

    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class);
    }

    public function createdByDealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class, 'created_by_dealer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(DealerRetailSaleItem::class);
    }
}
