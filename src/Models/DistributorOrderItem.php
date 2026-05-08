<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DistributorOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'distributor_order_id',
        'product_id',
        'quantity',
        'unit_price',
        'gst_rate',
        'tax_amount',
        'subtotal',
        'price_source',
    ];

    protected $casts = [
        'quantity' => 'int',
        'unit_price' => 'float',
        'gst_rate' => 'float',
        'tax_amount' => 'float',
        'subtotal' => 'float',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(DistributorOrder::class, 'distributor_order_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function serialNumbers(): BelongsToMany
    {
        return $this->belongsToMany(SerialNumber::class, 'distributor_order_item_serial_numbers');
    }
}
