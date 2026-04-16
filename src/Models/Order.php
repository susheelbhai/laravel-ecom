<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address_id',
        'promo_code_id',
        'promo_code_used',
        'discount_amount',
        'subtotal_amount',
        'order_number',
        'payment_gateway_order_id',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
        'notes',
        // Shipping address fields
        'shipping_full_name',
        'shipping_phone',
        'shipping_alternate_phone',
        'shipping_address_line1',
        'shipping_address_line2',
        'shipping_city',
        'shipping_state',
        'shipping_country',
        'shipping_pincode',
        'shipping_landmark',
        // Pickup address fields
        'warehouse_id',
        'pickup_name',
        'pickup_phone',
        'pickup_email',
        'pickup_address_line1',
        'pickup_address_line2',
        'pickup_city',
        'pickup_state',
        'pickup_country',
        'pickup_pincode',
    ];

    protected $casts = [
        'discount_amount' => 'float',
        'subtotal_amount' => 'float',
        'total_amount' => 'float',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the address for the order.
     */
    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    /**
     * Get the items for the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the promo code for the order.
     */
    public function promoCode(): BelongsTo
    {
        return $this->belongsTo(PromoCode::class);
    }

    /**
     * Get the warehouse for the order.
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the payments for the order.
     */
    public function payments(): MorphMany
    {
        return $this->morphMany(\Susheelbhai\Larapay\Models\Payment::class, 'payable');
    }

    /**
     * Get the full shipping address as a single string.
     */
    public function getFullShippingAddressAttribute(): string
    {
        $parts = [
            $this->shipping_address_line1,
            $this->shipping_address_line2,
            $this->shipping_landmark,
            $this->shipping_city,
            $this->shipping_state,
            $this->shipping_country,
            $this->shipping_pincode,
        ];

        return implode(', ', array_filter($parts));
    }

    /**
     * Get the full pickup address as a single string.
     */
    public function getFullPickupAddressAttribute(): string
    {
        $parts = [
            $this->pickup_address_line1,
            $this->pickup_address_line2,
            $this->pickup_city,
            $this->pickup_state,
            $this->pickup_country,
            $this->pickup_pincode,
        ];

        return implode(', ', array_filter($parts));
    }

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNumber(): string
    {
        return 'ORD-'.time().'-'.uniqid();
    }
}
