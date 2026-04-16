<?php

namespace App\Models;

use App\Models\BaseModels\BaseExternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blog extends BaseExternalMediaModel
{
    use HasDynamicMediaAttributes, HasFactory;

    protected $mediaAttributes = [
        'display_img',
        'ad_img',
    ];

    public function registerMediaCollections(): void
    {
        foreach ($this->mediaAttributes as $attribute) {
            $this->addMediaCollection($attribute)->singleFile();
        }
    }
}
