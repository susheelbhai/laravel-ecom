<?php

namespace App\Models\BaseModels;

use App\Models\MediaInternal;
use Spatie\MediaLibrary\MediaCollections\MediaCollection;

abstract class BaseInternalAuthenticatable extends BaseAuthenticatable
{
    public function getMediaModel(): string
    {
        return MediaInternal::class;
    }

    public function addMediaCollection(string $name): MediaCollection
    {
        return parent::addMediaCollection($name)->useDisk('internal_media');
    }
}
