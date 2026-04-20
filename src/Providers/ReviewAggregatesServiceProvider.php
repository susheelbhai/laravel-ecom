<?php

namespace App\Providers;

use App\Models\Review;
use Illuminate\Support\ServiceProvider;
use Susheelbhai\Ecom\Observers\ReviewObserver;

class ReviewAggregatesServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if (! class_exists(Review::class)) {
            return;
        }

        Review::observe(ReviewObserver::class);
    }
}
