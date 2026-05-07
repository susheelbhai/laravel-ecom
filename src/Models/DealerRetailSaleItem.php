<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DealerRetailSaleItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'dealer_retail_sale_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
        'serial_number_id',
    ];

    protected $casts = [
        'quantity' => 'int',
        'unit_price' => 'float',
        'subtotal' => 'float',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(DealerRetailSale::class, 'dealer_retail_sale_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function warrantyCards(): HasOne
    {
        return $this->hasOne(WarrantyCard::class);
    }

    public function serialNumber(): BelongsTo
    {
        return $this->belongsTo(SerialNumber::class);
    }
}
