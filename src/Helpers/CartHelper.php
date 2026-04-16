<?php

namespace App\Helpers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartHelper
{
    /**
     * Get or create the cart for the current user/guest.
     * This is the single source of truth for cart retrieval.
     */
    public static function getCart(?Request $request = null): Cart
    {
        $request = $request ?? request();
        $user = Auth::user() ?? $request->user();
        $ipAddress = $request->ip();

        if ($user) {
            // Check if there's a guest cart with this IP address (for migration)
            $guestCart = Cart::where('user_id', null)
                ->where('ip_address', $ipAddress)
                ->first();

            if ($guestCart) {
                // Migrate guest cart to user
                $guestCart->update(['user_id' => $user->id]);

                return $guestCart;
            }

            // Get or create user cart
            return Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['ip_address' => $ipAddress]
            );
        }

        // Return or create guest cart with ip_address only
        return Cart::firstOrCreate(
            ['user_id' => null, 'ip_address' => $ipAddress]
        );
    }

    /**
     * Get the cart count (sum of quantities) for the current user/guest.
     */
    public static function getCartCount(?Request $request = null): int
    {
        $request = $request ?? request();
        $cart = self::findCart($request);

        if (! $cart) {
            return 0;
        }

        return $cart->items()->sum('quantity') ?? 0;
    }

    /**
     * Get cart product IDs for the current user/guest.
     */
    public static function getCartProductIds(?Request $request = null): array
    {
        $request = $request ?? request();
        $cart = self::findCart($request);

        if (! $cart) {
            return [];
        }

        return $cart->items()->pluck('product_id')->toArray();
    }

    /**
     * Find the cart without creating one (for read-only operations).
     */
    public static function findCart(?Request $request = null): ?Cart
    {
        $request = $request ?? request();
        $user = Auth::user() ?? $request->user();
        $ipAddress = $request->ip();

        if ($user) {
            // First check for user cart
            $userCart = Cart::where('user_id', $user->id)->first();

            if ($userCart) {
                return $userCart;
            }

            // Fall back to guest cart with same IP (pre-migration state)
            return Cart::where('user_id', null)
                ->where('ip_address', $ipAddress)
                ->first();
        }

        // Guest cart
        return Cart::where('user_id', null)
            ->where('ip_address', $ipAddress)
            ->first();
    }
}
