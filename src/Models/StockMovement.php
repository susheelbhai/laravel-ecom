<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'rack_id',
        'type',
        'quantity',
        'reason',
        'reference_type',
        'reference_id',
        'created_by',
    ];

    protected $appends = [
        'type_color',
        'type_icon',
        'type_label',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function rack(): BelongsTo
    {
        return $this->belongsTo(WarehouseRack::class, 'rack_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeForProductAndRack($query, int $productId, int $rackId)
    {
        return $query->where('product_id', $productId)
            ->where('rack_id', $rackId);
    }

    public function scopeIncoming($query)
    {
        return $query->whereIn('type', ['in', 'transfer_in', 'adjustment'])
            ->where(function ($q) {
                $q->where('type', '!=', 'adjustment')
                    ->orWhere(function ($q2) {
                        $q2->where('type', 'adjustment');
                    });
            });
    }

    public function scopeOutgoing($query)
    {
        return $query->whereIn('type', ['out', 'transfer_out']);
    }

    public static function calculateCurrentStock(int $productId, int $rackId): int
    {
        $incoming = self::forProductAndRack($productId, $rackId)
            ->whereIn('type', ['in', 'transfer_in'])
            ->sum('quantity');

        $outgoing = self::forProductAndRack($productId, $rackId)
            ->where('type', 'out')
            ->sum('quantity');

        // transfer_out is stored as negative, so we add it (which subtracts from total)
        $transfers = self::forProductAndRack($productId, $rackId)
            ->where('type', 'transfer_out')
            ->sum('quantity');

        $adjustments = self::forProductAndRack($productId, $rackId)
            ->where('type', 'adjustment')
            ->sum('quantity');

        return $incoming - $outgoing + $transfers + $adjustments;
    }

    public function getTypeColorAttribute(): string
    {
        return match ($this->type) {
            'in', 'transfer_in' => 'success',
            'out', 'transfer_out' => 'danger',
            'adjustment' => 'warning',
            default => 'secondary',
        };
    }

    public function getTypeIconAttribute(): string
    {
        return match ($this->type) {
            'in' => 'fas fa-arrow-down',
            'out' => 'fas fa-arrow-up',
            'transfer_in' => 'fas fa-arrow-right',
            'transfer_out' => 'fas fa-arrow-left',
            'adjustment' => 'fas fa-adjust',
            default => 'fas fa-circle',
        };
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'in' => 'Stock In',
            'out' => 'Stock Out',
            'transfer_in' => 'Transfer In',
            'transfer_out' => 'Transfer Out',
            'adjustment' => 'Adjustment',
            default => ucfirst($this->type),
        };
    }
}
