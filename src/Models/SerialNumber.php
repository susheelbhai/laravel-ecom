<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SerialNumber extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'rack_id',
        'stock_movement_id',
        'serial_number',
        'status',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function rack(): BelongsTo
    {
        return $this->belongsTo(WarehouseRack::class, 'rack_id');
    }

    public function stockMovement(): BelongsTo
    {
        return $this->belongsTo(StockMovement::class);
    }

    public function warrantyCard(): HasOne
    {
        return $this->hasOne(WarrantyCard::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(SerialNumberMovement::class);
    }

    public function technicianScans(): HasMany
    {
        return $this->hasMany(TechnicianScan::class);
    }

    /**
     * The retail sale item this serial number was sold on.
     * FK is on dealer_retail_sale_items.serial_number_id.
     */
    public function retailSaleItem(): HasOne
    {
        return $this->hasOne(DealerRetailSaleItem::class);
    }

    public function distributorOrderItems(): BelongsToMany
    {
        return $this->belongsToMany(
            DistributorOrderItem::class,
            'distributor_order_item_serial_numbers'
        );
    }

    public function dealerOrderItems(): BelongsToMany
    {
        return $this->belongsToMany(
            DealerOrderItem::class,
            'dealer_order_item_serial_numbers'
        );
    }

    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    public function isStolen(): bool
    {
        return $this->status === 'stolen';
    }

    public function isDamaged(): bool
    {
        return $this->status === 'damaged';
    }

    public function markAsSold(): void
    {
        $this->status = 'sold';
        $this->save();
    }
}
