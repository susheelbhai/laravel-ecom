<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductWarranty extends Model
{
    protected $fillable = [
        'product_id',
        'duration',
        'duration_unit',
        'terms',
    ];

    protected function casts(): array
    {
        return [
            'duration' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Calculate the warranty expiry date from a given purchase date.
     */
    public function calculateExpiryDate(Carbon $purchaseDate): Carbon
    {
        return match ($this->duration_unit) {
            'days' => $purchaseDate->copy()->addDays($this->duration),
            'months' => $purchaseDate->copy()->addMonths($this->duration),
            'years' => $purchaseDate->copy()->addYears($this->duration),
            default => $purchaseDate->copy()->addYears($this->duration),
        };
    }

    /**
     * Human-readable duration label, e.g. "2 Years", "6 Months".
     */
    public function getDurationLabelAttribute(): string
    {
        $unit = ucfirst($this->duration_unit);
        if ($this->duration === 1) {
            $unit = rtrim($unit, 's');
        }

        return "{$this->duration} {$unit}";
    }
}
