<?php

namespace App\Models;

use App\Models\BaseModels\BaseInternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductPageBanner extends BaseInternalMediaModel
{
    /** @use HasFactory<\Database\Factories\ProductPageBannerFactory> */
    use HasDynamicMediaAttributes, HasFactory;

    protected $mediaAttributes = [
        'banner_image',
    ];

    protected $fillable = [
        'href',
        'target',
        'display_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    public function registerMediaCollections(): void
    {
        foreach ($this->mediaAttributes as $attribute) {
            $this->addMediaCollection($attribute)
                ->singleFile();
        }
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('banner_image', 'large');
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('banner_image', 'thumb');
    }
}
