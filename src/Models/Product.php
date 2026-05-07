<?php

namespace App\Models;

use App\Models\BaseModels\BaseExternalMediaModel;
use App\Services\ReviewAggregationService;
use App\Traits\HasDynamicMediaAttributes;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Susheelbhai\Laraship\Traits\HasShippingDimensions;

class Product extends BaseExternalMediaModel
{
    /** @use HasFactory<ProductFactory> */
    use HasDynamicMediaAttributes, HasFactory, HasShippingDimensions;

    protected $mediaAttributes = ['images'];

    protected $appends = ['images', 'thumbnail', 'display_img'];

    protected $casts = [
        'features' => 'array',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images');
    }

    /**
     * Get the product category.
     */
    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    /**
     * Get the stock records for this product.
     */
    public function stockRecords()
    {
        return $this->hasMany(StockRecord::class);
    }

    /**
     * Get the warranty configuration for this product.
     */
    public function warranty()
    {
        return $this->hasOne(ProductWarranty::class);
    }

    /**
     * Get the serial numbers for this product.
     */
    public function serialNumbers()
    {
        return $this->hasMany(SerialNumber::class);
    }

    /**
     * Get the total available stock across all warehouses.
     */
    public function getTotalStockAttribute(): int
    {
        $incoming = StockMovement::where('product_id', $this->id)
            ->whereIn('type', ['in', 'transfer_in'])
            ->sum('quantity');

        $outgoing = StockMovement::where('product_id', $this->id)
            ->where('type', 'out')
            ->sum('quantity');

        // transfer_out is stored as negative, so we add it (which subtracts from total)
        $transfers = StockMovement::where('product_id', $this->id)
            ->where('type', 'transfer_out')
            ->sum('quantity');

        $adjustments = StockMovement::where('product_id', $this->id)
            ->where('type', 'adjustment')
            ->sum('quantity');

        return $incoming - $outgoing + $transfers + $adjustments;
    }

    /**
     * Check if product has sufficient stock.
     */
    public function hasStock(int $quantity): bool
    {
        if (! $this->manage_stock) {
            return true;
        }

        return $this->total_stock >= $quantity;
    }

    /**
     * Get the product images.
     */
    public function images(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getMedia('images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'size' => $media->size,
                    'mime_type' => $media->mime_type,
                ];
            }),
        );
    }

    /**
     * Get the product thumbnail (first image thumbnail).
     */
    public function thumbnail(): Attribute
    {
        return Attribute::make(
            get: function () {
                $firstMedia = $this->getFirstMedia('images');

                return $firstMedia ? $firstMedia->getUrl('thumb') : null;
            }
        );
    }

    /**
     * Get the product display image (first image full URL).
     */
    public function displayImg(): Attribute
    {
        return Attribute::make(
            get: function () {
                $firstMedia = $this->getFirstMedia('images');

                return $firstMedia ? $firstMedia->getUrl() : null;
            }
        );
    }

    /**
     * Get all reviews for this product.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get approved reviews for this product.
     */
    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->where('status', 'approved');
    }

    /**
     * Get the average rating for this product.
     */
    public function averageRating(): Attribute
    {
        return Attribute::make(
            get: function () {
                $service = app(ReviewAggregationService::class);

                return $service->calculateAverageRating($this);
            }
        );
    }

    /**
     * Get the review count for this product.
     */
    public function reviewCount(): Attribute
    {
        return Attribute::make(
            get: function () {
                $service = app(ReviewAggregationService::class);

                return $service->getReviewCount($this);
            }
        );
    }
}
