<?php

namespace App\Models;

use App\Models\BaseModels\BaseInternalMediaModel;
use App\Traits\HasDynamicMediaAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Setting extends BaseInternalMediaModel
{
    use HasDynamicMediaAttributes, HasFactory;

    protected $mediaAttributes = [
        'square_dark_logo',
        'square_light_logo',
        'dark_logo',
        'light_logo',
    ];

    protected $guarded = [];

    protected $casts = [
        'trust_badges' => 'array',
    ];

    protected $appends = ['favicon', 'square_dark_logo', 'square_dark_logo_converted', 'square_light_logo', 'square_light_logo_converted', 'dark_logo', 'dark_logo_converted', 'light_logo', 'light_logo_converted'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('square_dark_logo')
            ->singleFile();

        $this->addMediaCollection('square_light_logo')
            ->singleFile();

        $this->addMediaCollection('dark_logo')
            ->singleFile();

        $this->addMediaCollection('light_logo')
            ->singleFile();
    }

    public function getFaviconAttribute(): string
    {
        $media = $this->getFirstMedia('square_dark_logo');

        return $media ? $media->getUrl('thumbSquare') : '/dummy.png';
    }

    public function getSquareDarkLogoAttribute(): string
    {
        $media = $this->getFirstMedia('square_dark_logo');

        return $media ? $media->getUrl() : '/dummy.png';
    }

    public function getSquareDarkLogoConvertedAttribute(): array
    {
        $media = $this->getFirstMedia('square_dark_logo');
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

    public function getSquareLightLogoAttribute(): string
    {
        $media = $this->getFirstMedia('square_light_logo');

        return $media ? $media->getUrl() : '/dummy.png';
    }

    public function getSquareLightLogoConvertedAttribute(): array
    {
        $media = $this->getFirstMedia('square_light_logo');
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

    public function getDarkLogoAttribute(): string
    {
        $media = $this->getFirstMedia('dark_logo');

        return $media ? $media->getUrl('small') : '/dummy.png';
    }

    public function getDarkLogoConvertedAttribute(): array
    {
        $media = $this->getFirstMedia('dark_logo');
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

    public function getLightLogoAttribute(): string
    {
        $media = $this->getFirstMedia('light_logo');

        return $media ? $media->getUrl('small') : '/dummy.png';
    }

    public function getLightLogoConvertedAttribute(): array
    {
        $media = $this->getFirstMedia('light_logo');
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
