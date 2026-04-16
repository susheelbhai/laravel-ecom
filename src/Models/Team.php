<?php

namespace App\Models;

use App\Models\BaseModels\BaseInternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Team extends BaseInternalMediaModel
{
    use HasDynamicMediaAttributes, HasFactory;

    protected $table = 'team';

    protected array $mediaAttributes = [
        'image',
    ];

    public function registerMediaCollections(): void
    {
        foreach ($this->mediaAttributes as $attribute) {
            $this->addMediaCollection($attribute)->singleFile();
        }
    }
}
