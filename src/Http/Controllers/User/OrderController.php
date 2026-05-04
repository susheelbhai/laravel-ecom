<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Auth::user()->orders()
            ->with(['items.product', 'address'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform orders to include product thumbnails
        $ordersData = $orders->map(function ($order) {
            $orderData = $order->toArray();
            $orderData['items'] = $order->items->map(function ($item) {
                $itemData = $item->toArray();
                $itemData['product']['thumbnail'] = $item->product->getFirstMediaUrl('images', 'small') ?: $item->product->display_img;

                return $itemData;
            })->toArray();

            return $orderData;
        })->toArray();

        $this->seo(
            title: 'My Orders',
            description: 'View and track all your past and current orders.',
            canonical: route('orders.index'),
        );

        return $this->render('user/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['items.product', 'address', 'shipment']);

        // Transform order items to include thumbnails
        $orderData = $order->toArray();
        $orderData['items'] = $order->items->map(function ($item) {
            $itemData = $item->toArray();
            $itemData['product']['thumbnail'] = $item->product->getFirstMediaUrl('images', 'small') ?: $item->product->display_img;

            return $itemData;
        })->toArray();
        $order = (object) $orderData;

        $this->seo(
            title: "Order #{$order->order_number}",
            description: "View the details and status of order #{$order->order_number}.",
        );

        return $this->render('user/orders/show', [
            'order' => $order,
        ]);
    }
}
