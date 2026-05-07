<?php

namespace App\Models;

use App\Models\BaseModels\BaseInternalMediaModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributorOrderPayment extends BaseInternalMediaModel
{
    use HasFactory;

    protected $fillable = [
        'distributor_order_id',
        'amount',
        'payment_method',
        'note',
        'recorded_by_admin_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('payment_proof')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'application/pdf']);
    }

    public function distributorOrder(): BelongsTo
    {
        return $this->belongsTo(DistributorOrder::class);
    }

    public function recordedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'recorded_by_admin_id');
    }
}
