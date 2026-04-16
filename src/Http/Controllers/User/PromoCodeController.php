<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PromoCodeController extends Controller
{
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $promoCode = PromoCode::where('code', strtoupper($request->code))->first();

        if (! $promoCode) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid promo code.',
            ], 404);
        }

        if (! $promoCode->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'This promo code is no longer valid.',
            ], 400);
        }

        if (! $promoCode->canBeUsedByUser(Auth::id())) {
            return response()->json([
                'success' => false,
                'message' => 'You have reached the usage limit for this promo code.',
            ], 400);
        }

        $cart = Cart::where('user_id', Auth::id())->with('items.product')->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty.',
            ], 400);
        }

        $subtotal = $cart->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        $discount = $promoCode->calculateDiscount($subtotal);

        if ($discount === 0.0) {
            $minAmount = $promoCode->min_order_amount;

            return response()->json([
                'success' => false,
                'message' => "Minimum order amount of ₹{$minAmount} required to use this promo code.",
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Promo code applied successfully!',
            'data' => [
                'promo_code_id' => $promoCode->id,
                'code' => $promoCode->code,
                'discount_type' => $promoCode->discount_type,
                'discount_value' => $promoCode->discount_value,
                'discount_amount' => $discount,
                'subtotal' => $subtotal,
                'total' => $subtotal - $discount,
            ],
        ]);
    }
}
