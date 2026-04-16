<?php

namespace App\Http\Controllers\User;

use App\Helpers\CartHelper;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected function getCart()
    {
        return CartHelper::getCart();
    }

    public function index()
    {
        $cart = $this->getCart()->load('items.product');

        // Transform cart items to include product thumbnails
        if ($cart && $cart->items) {
            $cartData = $cart->toArray();
            $cartData['items'] = $cart->items->map(function ($item) {
                $itemData = $item->toArray();
                $itemData['product']['thumbnail'] = $item->product->getFirstMediaUrl('images', 'small') ?: $item->product->display_img;

                return $itemData;
            })->toArray();
            $cart = (object) $cartData;
        }

        return Inertia::render('user/cart/index', [
            'cart' => $cart,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $product = Product::find($request->product_id);

        $existingItem = $cart->items()->where('product_id', $request->product_id)->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->quantity,
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $product->price,
            ]);
        }

        return redirect()->back()->with('success', 'Product added to cart.');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Ensure the cart item belongs to the current user's cart or guest cart
        $cart = $this->getCart();
        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return redirect()->back()->with('success', 'Cart updated.');
    }

    public function remove(CartItem $cartItem)
    {
        // Ensure the cart item belongs to the current user's cart or guest cart
        $cart = $this->getCart();
        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $cartItem->delete();

        return redirect()->back()->with('success', 'Item removed from cart.');
    }
}
