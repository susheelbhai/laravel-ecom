<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductPageBannerRequest;
use App\Http\Requests\UpdateProductPageBannerRequest;
use App\Models\ProductPageBanner;

class ProductPageBannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = ProductPageBanner::latest()->get()->map(function ($banner) {
            return [
                ...$banner->toArray(),
                'thumbnail' => $banner->thumbnail_url,
                'image_url' => $banner->image_url,
            ];
        });

        return $this->render('admin/resources/product-page-banner/index', compact('data'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->render('admin/resources/product-page-banner/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductPageBannerRequest $request)
    {
        $banner = ProductPageBanner::create([
            'href' => $request->href,
            'target' => $request->target ?? '_self',
            'display_order' => $request->display_order,
            'is_active' => $request->is_active,
        ]);

        if ($request->hasFile('image')) {
            // Temporarily disable queued conversions for immediate processing
            config(['media-library.queue_conversions_by_default' => false]);

            $banner->addMedia($request->file('image'))
                ->toMediaCollection('banner_image');

            // Re-enable queued conversions
            config(['media-library.queue_conversions_by_default' => true]);
        }

        return redirect()
            ->route('admin.product-page-banner.index')
            ->with('success', 'Banner created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $data = ProductPageBanner::findOrFail($id);
        $media = $data->getFirstMedia('banner_image');
        $data = [
            ...$data->toArray(),
            'thumbnail' => $data->thumbnail_url,
            'image' => $data->image_url,
            'media' => $media,
        ];

        return $this->render('admin/resources/product-page-banner/edit', compact('data'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductPageBannerRequest $request, string $id)
    {
        $banner = ProductPageBanner::findOrFail($id);

        $banner->update([
            'href' => $request->href,
            'target' => $request->target ?? '_self',
            'display_order' => $request->display_order,
            'is_active' => $request->is_active,
        ]);

        if ($request->hasFile('image')) {
            $banner->clearMediaCollection('banner_image');

            // Temporarily disable queued conversions for immediate processing
            config(['media-library.queue_conversions_by_default' => false]);

            $banner->addMedia($request->file('image'))
                ->toMediaCollection('banner_image');

            // Re-enable queued conversions
            config(['media-library.queue_conversions_by_default' => true]);
        }

        return redirect()
            ->route('admin.product-page-banner.index')
            ->with('success', 'Banner updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $banner = ProductPageBanner::findOrFail($id);
            $banner->clearMediaCollection('banner_image');
            $banner->delete();

            return redirect()
                ->route('admin.product-page-banner.index')
                ->with('success', 'Banner deleted successfully');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete banner: '.$e->getMessage());
        }
    }
}
