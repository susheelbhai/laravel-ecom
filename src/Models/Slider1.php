<?php

namespace App\Models;

use App\Models\BaseModels\BaseExternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Slider1 extends BaseExternalMediaModel
{
    use HasDynamicMediaAttributes, HasFactory;

    protected $table = 'slider1';

    protected array $mediaAttributes = [
        'image1',
        'image2',
    ];

    public function registerMediaCollections(): void
    {
        foreach ($this->mediaAttributes as $attribute) {
            $this->addMediaCollection($attribute)->singleFile();
        }
    }
}
