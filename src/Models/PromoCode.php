<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PromoCode extends Model
{
    /** @use HasFactory<\Database\Factories\PromoCodeFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'min_order_amount',
        'max_discount_amount',
        'usage_limit',
        'usage_count',
        'per_user_limit',
        'partner_id',
        'is_active',
        'valid_from',
        'valid_until',
    ];

    protected function casts(): array
    {
        return [
            'discount_value' => 'float',
            'min_order_amount' => 'float',
            'max_discount_amount' => 'float',
            'usage_limit' => 'integer',
            'usage_count' => 'integer',
            'per_user_limit' => 'integer',
            'is_active' => 'boolean',
            'valid_from' => 'datetime',
            'valid_until' => 'datetime',
        ];
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('usage_count')
            ->withTimestamps();
    }

    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        $now = now();

        if ($this->valid_from && $now->lt($this->valid_from)) {
            return false;
        }

        if ($this->valid_until && $now->gt($this->valid_until)) {
            return false;
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    public function canBeUsedByUser(int $userId): bool
    {
        if (! $this->isValid()) {
            return false;
        }

        if (! $this->per_user_limit) {
            return true;
        }

        $userUsage = $this->users()->where('user_id', $userId)->first();

        if (! $userUsage) {
            return true;
        }

        return $userUsage->pivot->usage_count < $this->per_user_limit;
    }

    public function calculateDiscount(float $subtotal): float
    {
        if ($this->min_order_amount && $subtotal < $this->min_order_amount) {
            return 0;
        }

        $discount = 0;

        if ($this->discount_type === 'percentage') {
            $discount = ($subtotal * $this->discount_value) / 100;
        } else {
            $discount = $this->discount_value;
        }

        if ($this->max_discount_amount && $discount > $this->max_discount_amount) {
            $discount = $this->max_discount_amount;
        }

        return round($discount, 2);
    }

    public function incrementUsage(int $userId): void
    {
        $this->increment('usage_count');

        $userUsage = $this->users()->where('user_id', $userId)->first();

        if ($userUsage) {
            $this->users()->updateExistingPivot($userId, [
                'usage_count' => $userUsage->pivot->usage_count + 1,
            ]);
        } else {
            $this->users()->attach($userId, ['usage_count' => 1]);
        }
    }
}
