<?php

namespace App\Models;

use App\Models\BaseModels\BaseExternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductCategory extends BaseExternalMediaModel
{
    /** @use HasFactory<\Database\Factories\ProductCategoryFactory> */
    use HasDynamicMediaAttributes, HasFactory;

    protected $mediaAttributes = [
        'icon',
        'banner',
    ];

    public function registerMediaCollections(): void
    {
        foreach ($this->mediaAttributes as $attribute) {
            $this->addMediaCollection($attribute)->singleFile();
        }
    }
}
