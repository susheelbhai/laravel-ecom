<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ProductPageBanner;
use Illuminate\Http\JsonResponse;

class ProductPageBannerController extends Controller
{
    /**
     * Get all active product page banners ordered by display order.
     */
    public function getActiveBanners(): JsonResponse
    {
        $banners = ProductPageBanner::active()
            ->ordered()
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'imageUrl' => $banner->image_url,
                    'href' => $banner->href,
                    'target' => $banner->target ?? '_self',
                    'alt' => "Banner {$banner->display_order}",
                ];
            });

        return response()->json($banners);
    }
}
