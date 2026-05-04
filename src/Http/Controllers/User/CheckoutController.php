<?php

namespace App\Http\Controllers\User;

use App\Actions\ConfirmOrder;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        $cart = Cart::where('user_id', Auth::id())
            ->with('items.product')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        // Calculate total
        $total = $cart->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        // Get user addresses
        $addresses = $user->addresses()->orderBy('is_default', 'desc')->get();
        // Transform cart items to include thumbnails
        $cartData = $cart->toArray();
        $cartData['items'] = $cart->items->map(function ($item) {
            $itemData = $item->toArray();
            $itemData['product']['thumbnail'] = $item->product->getFirstMediaUrl('images', 'small') ?: $item->product->display_img;

            return $itemData;
        })->toArray();
        $cart = (object) $cartData;

        $this->seo(
            title: 'Checkout',
            description: 'Complete your purchase securely. Select your delivery address and payment method to place your order.',
            canonical: route('checkout.index'),
        );

        return $this->render('user/checkout/index', [
            'cart' => $cart,
            'addresses' => $addresses,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:cod,online',
            'promo_code_id' => 'nullable|exists:promo_codes,id',
        ]);

        // Verify address belongs to user
        $address = $user->addresses()->find($request->address_id);
        if (! $address) {
            return back()->with('error', 'Invalid address selected.');
        }

        $cart = Cart::where('user_id', Auth::id())
            ->with('items.product')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        try {
            // Create orders via ConfirmOrder action (may create multiple orders for different warehouses)
            // Stock validation happens inside the transaction with pessimistic locking
            $processImmediately = $request->payment_method === 'cod';
            $orders = app(ConfirmOrder::class)->execute(
                Auth::id(),
                $request->address_id,
                $request->payment_method,
                $processImmediately,
                $request->promo_code_id
            );

            // If COD, orders are processed and ready
            if ($request->payment_method === 'cod') {
                $message = count($orders) > 1
                    ? 'Orders placed successfully! Your items have been split into '.count($orders).' orders based on warehouse locations.'
                    : 'Order placed successfully!';

                return redirect()->route('order.success', $orders[0]->id)
                    ->with('success', $message)
                    ->with('all_orders', $orders);
            }

            // If online payment, redirect to payment initiation for the first order
            // Note: For multiple orders with online payment, you may need to handle this differently
            return $this->initiatePayment($orders[0]);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function initiatePayment(Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        // Prepare payment data
        $user = Auth::user();

        $this->seo(
            title: 'Processing Payment',
            description: 'Please wait while we redirect you to the payment gateway to complete your order.',
        );

        return $this->render('user/checkout/payment', [
            'order' => $order,
            'paymentData' => [
                'order_id' => $order->order_number,
                'amount' => $order->total_amount,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'name' => $user->name,
                'action_url' => route('order.success', $order->id),
                'redirect_url' => route('order.success', $order->id),
                'gateway' => config('payment.gateway_id'),
                'gst_percentage' => 0,
            ],
        ]);
    }

    public function success(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['items.product', 'address']);

        // Transform order items to include thumbnails
        $orderData = $order->toArray();
        $orderData['items'] = $order->items->map(function ($item) {
            $itemData = $item->toArray();
            $itemData['product']['thumbnail'] = $item->product->getFirstMediaUrl('images', 'small') ?: $item->product->display_img;

            return $itemData;
        })->toArray();
        $order = (object) $orderData;

        $this->seo(
            title: 'Order Placed Successfully',
            description: 'Your order has been placed successfully. Thank you for shopping with us.',
        );

        return $this->render('user/checkout/success', [
            'order' => $order,
        ]);
    }
}
