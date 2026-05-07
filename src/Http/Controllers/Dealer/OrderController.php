<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\DealerOrder;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $dealerId = Auth::guard('dealer')->id();

        $data = DealerOrder::query()
            ->where('dealer_id', $dealerId)
            ->with('distributor:id,name,email')
            ->latest('id')
            ->paginate(15)
            ->through(fn (DealerOrder $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'distributor_name' => $order->distributor?->name,
                'subtotal_amount' => $order->subtotal_amount,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at?->format('M d, Y'),
            ]);

        return $this->render('dealer/orders/index', compact('data'));
    }

    public function show(DealerOrder $order)
    {
        $dealerId = Auth::guard('dealer')->id();
        abort_unless($order->dealer_id === $dealerId, 403);

        $order->loadMissing([
            'items.product',
            'distributor',
            'payments.recordedByDistributor',
            'payments.media',
        ]);

        $payments = $order->payments
            ->sortBy('created_at')
            ->map(fn ($payment) => [
                'id' => $payment->id,
                'amount' => (float) $payment->amount,
                'payment_method' => $payment->payment_method,
                'note' => $payment->note,
                'recorded_by_name' => $payment->recordedByDistributor?->name ?? 'Distributor',
                'created_at' => $payment->created_at?->format('M d, Y H:i'),
                'payment_proof_url' => $payment->getFirstMediaUrl('payment_proof') ?: null,
            ])
            ->values()
            ->all();

        $data = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'distributor' => $order->distributor ? [
                'id' => $order->distributor->id,
                'name' => $order->distributor->name,
                'email' => $order->distributor->email,
            ] : null,
            'subtotal_amount' => $order->subtotal_amount,
            'total_amount' => $order->total_amount,
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_title' => $item->product?->title,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
                'price_source' => $item->price_source,
            ]),
            'created_at' => $order->created_at?->format('M d, Y H:i'),
            'payment_summary' => [
                'payment_status' => $order->payment_status ?? 'unpaid',
                'amount_paid' => (float) ($order->amount_paid ?? 0),
                'remaining_balance' => (float) $order->total_amount - (float) ($order->amount_paid ?? 0),
                'payments' => $payments,
            ],
        ];

        return $this->render('dealer/orders/show', compact('data'));
    }
}
