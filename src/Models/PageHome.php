<?php

namespace App\Models;

use App\Models\BaseModels\BaseInternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PageHome extends BaseInternalMediaModel
{
    use HasDynamicMediaAttributes, HasFactory;

    protected $table = 'page_home';

    protected array $mediaAttributes = [
        'banner_image',
        'about_image',
        'why_us_image',
    ];

    public function registerMediaCollections(): void
    {
        foreach ($this->mediaAttributes as $attribute) {
            $this->addMediaCollection($attribute)->singleFile();
        }
    }
}
