<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductWarranty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProductWarrantyController extends Controller
{
    public function edit(Product $product)
    {
        $warranty = $product->warranty;

        return $this->render('admin/resources/product_warranty/edit', [
            'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'sku' => $product->sku,
            ],
            'warranty' => $warranty ? [
                'id' => $warranty->id,
                'duration' => $warranty->duration,
                'duration_unit' => $warranty->duration_unit,
                'terms' => $warranty->terms,
            ] : null,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'duration' => ['required', 'integer', 'min:1', 'max:9999'],
            'duration_unit' => ['required', 'in:days,months,years'],
            'terms' => ['nullable', 'string'],
        ]);

        ProductWarranty::updateOrCreate(
            ['product_id' => $product->id],
            $validated
        );

        return redirect()
            ->route('admin.product.show', $product)
            ->with('success', 'Warranty information updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->warranty?->delete();

        return redirect()
            ->route('admin.product.show', $product)
            ->with('success', 'Warranty information removed.');
    }
}
