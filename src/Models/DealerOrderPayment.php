<?php

namespace App\Models;

use App\Models\BaseModels\BaseInternalMediaModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DealerOrderPayment extends BaseInternalMediaModel
{
    use HasFactory;

    protected $fillable = [
        'dealer_order_id',
        'amount',
        'payment_method',
        'note',
        'recorded_by_distributor_id',
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

    public function dealerOrder(): BelongsTo
    {
        return $this->belongsTo(DealerOrder::class);
    }

    public function recordedByDistributor(): BelongsTo
    {
        return $this->belongsTo(Distributor::class, 'recorded_by_distributor_id');
    }
}
