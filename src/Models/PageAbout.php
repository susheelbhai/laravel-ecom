<?php

namespace App\Models;

use App\Models\BaseModels\BaseExternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PageAbout extends BaseExternalMediaModel
{
    use HasDynamicMediaAttributes, HasFactory;

    protected $table = 'page_about';

    protected array $mediaAttributes = [
        'banner',
        'founder_image',
    ];

    public function registerMediaCollections(): void
    {
        foreach ($this->mediaAttributes as $attribute) {
            $this->addMediaCollection($attribute)->singleFile();
        }
    }
}
