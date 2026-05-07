<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DealerOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'dealer_order_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
        'price_source',
    ];

    protected $casts = [
        'quantity' => 'int',
        'unit_price' => 'float',
        'subtotal' => 'float',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(DealerOrder::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function serialNumbers(): BelongsToMany
    {
        return $this->belongsToMany(SerialNumber::class, 'dealer_order_item_serial_numbers');
    }
}
