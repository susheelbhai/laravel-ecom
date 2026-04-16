<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'rack_id',
        'quantity',
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

    public function warehouse(): BelongsTo
    {
        return $this->rack()->getRelated()->warehouse();
    }

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class, 'product_id', 'product_id')
            ->where('rack_id', $this->rack_id);
    }

    public function scopeByStockStatus($query, string $status)
    {
        return match ($status) {
            'out_of_stock' => $query->where('quantity', 0),
            'low_stock' => $query->where('quantity', '>', 0)->where('quantity', '<=', 10),
            'in_stock' => $query->where('quantity', '>', 10),
            default => $query,
        };
    }

    public function recalculateQuantity(): void
    {
        $this->quantity = StockMovement::calculateCurrentStock($this->product_id, $this->rack_id);
        $this->save();
    }

    public static function getOrCreateForRack(int $productId, int $rackId): self
    {
        return self::firstOrCreate(
            ['product_id' => $productId, 'rack_id' => $rackId],
            ['quantity' => 0]
        );
    }
}
