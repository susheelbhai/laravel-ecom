<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'user_id' => $this->user_id,
            'rating' => $this->rating,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'helpful_count' => $this->helpful_count,
            'not_helpful_count' => $this->not_helpful_count,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar ?? null,
            ],
            'images' => $this->getMedia('images')->map(fn ($media) => [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumbnail' => $media->hasGeneratedConversion('thumbnail') ? $media->getUrl('thumbnail') : $media->getUrl(),
            ]),
            'videos' => $this->getMedia('videos')->map(fn ($media) => [
                'id' => $media->id,
                'url' => $media->getUrl(),
            ]),
        ];
    }
}
