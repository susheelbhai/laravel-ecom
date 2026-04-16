<?php

namespace App\Models;

use App\Models\BaseModels\BaseExternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Portfolio extends BaseExternalMediaModel
{
    use HasDynamicMediaAttributes, HasFactory;

    protected $table = 'clients';

    protected array $mediaAttributes = ['logo'];

    public function registerMediaCollections(): void
    {
        foreach ($this->mediaAttributes as $attribute) {
            $this->addMediaCollection($attribute)->singleFile();
        }
    }
}
