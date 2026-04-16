<?php

namespace App\Models\BaseModels;

use App\Models\MediaExternal;
use Spatie\MediaLibrary\MediaCollections\MediaCollection;

abstract class BaseExternalMediaModel extends BaseMediaModel
{
    public function getMediaModel(): string
    {
        return MediaExternal::class;
    }

    public function addMediaCollection(string $name): MediaCollection
    {
        return parent::addMediaCollection($name)->useDisk('external_media');
    }
}
