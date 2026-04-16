<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseRack extends Model
{
    use HasFactory;

    protected $fillable = [
        'warehouse_id',
        'identifier',
        'description',
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function stockRecords(): HasMany
    {
        return $this->hasMany(StockRecord::class, 'rack_id');
    }
}
