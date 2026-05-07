<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DistributorOrder extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_PLACED = 'placed';

    public static function generateOrderNumber(): string
    {
        return 'DORD-'.time().'-'.uniqid();
    }

    protected $fillable = [
        'order_number',
        'status',
        'distributor_id',
        'source_warehouse_id',
        'source_rack_id',
        'placed_by_admin_id',
        'placed_by_distributor_id',
        'approved_by_admin_id',
        'rejected_by_admin_id',
        'rejection_note',
        'approved_at',
        'rejected_at',
        'subtotal_amount',
        'total_amount',
        'payment_status',
        'amount_paid',
    ];

    protected $casts = [
        'subtotal_amount' => 'float',
        'total_amount' => 'float',
        'amount_paid' => 'float',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function distributor(): BelongsTo
    {
        return $this->belongsTo(Distributor::class);
    }

    public function sourceWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'source_warehouse_id');
    }

    public function sourceRack(): BelongsTo
    {
        return $this->belongsTo(WarehouseRack::class, 'source_rack_id');
    }

    public function placedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'placed_by_admin_id');
    }

    public function placedByDistributor(): BelongsTo
    {
        return $this->belongsTo(Distributor::class, 'placed_by_distributor_id');
    }

    public function approvedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'approved_by_admin_id');
    }

    public function rejectedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'rejected_by_admin_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(DistributorOrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(DistributorOrderPayment::class, 'distributor_order_id');
    }
}
