<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->with('items.product')->first();

        // Transform wishlist items to include product thumbnails
        if ($wishlist && $wishlist->items) {
            $wishlistData = $wishlist->toArray();
            $wishlistData['items'] = $wishlist->items->map(function ($item) {
                $itemData = $item->toArray();
                $itemData['product']['thumbnail'] = $item->product->getFirstMediaUrl('images', 'small') ?: $item->product->display_img;

                return $itemData;
            })->toArray();
            $wishlist = (object) $wishlistData;
        }

        return Inertia::render('user/wishlist/index', [
            'wishlist' => $wishlist,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->first() ?? Wishlist::create(['user_id' => $user->id]);

        $existingItem = $wishlist->items()->where('product_id', $request->product_id)->first();

        if (! $existingItem) {
            $wishlist->items()->create([
                'product_id' => $request->product_id,
            ]);
        }

        return redirect()->back()->with('success', 'Product added to wishlist.');
    }

    public function check(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->first();

        $inWishlist = false;
        if ($wishlist) {
            $inWishlist = $wishlist->items()->where('product_id', $request->product_id)->exists();
        }

        return response()->json(['in_wishlist' => $inWishlist]);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->first() ?? Wishlist::create(['user_id' => $user->id]);

        $existingItem = $wishlist->items()->where('product_id', $request->product_id)->first();

        if ($existingItem) {
            $existingItem->delete();

            return response()->json(['action' => 'removed']);
        } else {
            $wishlist->items()->create([
                'product_id' => $request->product_id,
            ]);

            return response()->json(['action' => 'added']);
        }
    }

    public function remove($productId)
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->first();

        if (! $wishlist) {
            abort(403, 'Unauthorized');
        }

        $wishlistItem = $wishlist->items()->where('product_id', $productId)->first();

        if (! $wishlistItem) {
            abort(403, 'Unauthorized');
        }

        $wishlistItem->delete();

        return redirect()->back()->with('success', 'Product removed from wishlist.');
    }
}
