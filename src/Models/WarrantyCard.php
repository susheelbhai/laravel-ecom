<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarrantyCard extends Model
{
    protected $fillable = [
        'card_number',
        'dealer_retail_sale_id',
        'dealer_retail_sale_item_id',
        'product_id',
        'serial_number_id',
        'dealer_id',
        'purchase_date',
        'warranty_expires_at',
        'terms_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'warranty_expires_at' => 'date',
        ];
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(DealerRetailSale::class, 'dealer_retail_sale_id');
    }

    public function saleItem(): BelongsTo
    {
        return $this->belongsTo(DealerRetailSaleItem::class, 'dealer_retail_sale_item_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function serialNumber(): BelongsTo
    {
        return $this->belongsTo(SerialNumber::class);
    }

    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class);
    }

    public function isExpired(): bool
    {
        return $this->warranty_expires_at->isPast();
    }

    public static function generateCardNumber(): string
    {
        return 'WC-'.strtoupper(substr(uniqid(), -6)).'-'.date('Ymd');
    }
}
