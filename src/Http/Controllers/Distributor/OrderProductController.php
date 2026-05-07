<?php

namespace App\Http\Controllers\Distributor;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderProductController extends Controller
{
    public function index(Request $request)
    {
        $data = Product::query()
            ->select(['id', 'title', 'slug', 'sku', 'price', 'distributor_price', 'mrp', 'manage_stock'])
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return $this->render('distributor/orders/products/index', compact('data'));
    }

    public function search(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        $escaped = '%'.addcslashes($q, '%_\\').'%';

        $products = Product::query()
            ->select(['id', 'title', 'sku', 'distributor_price', 'price'])
            ->where(function ($query) use ($escaped) {
                $query->where('title', 'like', $escaped)
                    ->orWhere('sku', 'like', $escaped);
            })
            ->orderBy('title')
            ->limit(30)
            ->get();

        return response()->json([
            'results' => $products->map(fn (Product $p) => [
                'id' => $p->id,
                'label' => $p->sku ? "{$p->title} ({$p->sku})" : $p->title,
                'distributor_price' => $p->distributor_price,
                'price' => $p->price,
            ]),
        ]);
    }

    public function price(Product $product): JsonResponse
    {
        return response()->json([
            'distributor_price' => $product->distributor_price,
            'price' => $product->price,
        ]);
    }
}
