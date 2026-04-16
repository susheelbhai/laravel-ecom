<?php

namespace App\Models\BaseModels;

use App\Traits\HasFormattedDates;
use App\Traits\HasMediaConversions;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

abstract class BaseAuthenticatable extends Authenticatable implements HasMedia
{
    use HasFormattedDates, HasMediaConversions, InteractsWithMedia {
        HasMediaConversions::registerMediaConversions insteadof InteractsWithMedia;
    }

    /**
     * Get the URL for the first media item in a collection.
     */
    protected function getMediaUrl(string $collection, string $default = '/dummy.png'): string
    {
        $media = $this->getFirstMedia($collection);

        return $media ? $media->getUrl() : $default;
    }

    /**
     * Get an array of URLs for generated conversions.
     */
    protected function getMediaConvertedUrls(string $collection): array
    {
        $media = $this->getFirstMedia($collection);
        if (! $media) {
            return [];
        }
        $urls = [];
        foreach ($media->getGeneratedConversions() as $conversionName => $isGenerated) {
            if ($isGenerated) {
                $urls[$conversionName] = $media->getUrl($conversionName);
            }
        }

        return $urls;
    }
}
