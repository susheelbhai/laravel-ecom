<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        $data = Order::with(['user', 'address', 'items.product'])
            ->latest()
            ->paginate(15)
            ->through(function ($order) {
                return [
                    ...$order->toArray(),
                    'user' => [
                        'id' => $order->user->id,
                        'name' => $order->user->name,
                        'email' => $order->user->email,
                    ],
                    'items_count' => $order->items->count(),
                ];
            });

        return $this->render('admin/resources/order/index', compact('data'));
    }

    public function show(Order $order)
    {
        $order->load(['user', 'address', 'items.product', 'payments', 'promoCode']);

        $orderData = [
            ...$order->toArray(),
            'user' => [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
            ],
            'items' => $order->items->map(function ($item) {
                return [
                    ...$item->toArray(),
                    'product' => [
                        'id' => $item->product->id,
                        'title' => $item->product->title,
                        'slug' => $item->product->slug,
                        'thumbnail' => $item->product->getFirstMediaUrl('images', 'thumb'),
                        'image' => $item->product->getFirstMediaUrl('images'),
                    ],
                ];
            }),
            'address' => $order->address,
            'payments' => $order->payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'payment_id' => $payment->payment_id,
                    'order_id' => $payment->order_id,
                    'amount' => $payment->amount,
                    'payment_gateway_id' => $payment->payment_gateway_id,
                    'payment_status' => $payment->payment_status,
                    'created_at' => $payment->created_at,
                    'updated_at' => $payment->updated_at,
                ];
            }),
            'promo_code_id' => $order->promo_code_id,
            'promo_code_used' => $order->promo_code_used,
            'discount_amount' => $order->discount_amount,
            'subtotal_amount' => $order->subtotal_amount,
        ];

        return $this->render('admin/resources/order/show', ['order' => $orderData]);
    }

    public function update(Order $order, $field, $value)
    {
        // For updating order status or payment status
        $order->update([$field => $value]);

        return back()->with('success', 'Order updated successfully');
    }
}
