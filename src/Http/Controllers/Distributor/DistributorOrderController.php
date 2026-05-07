<?php

namespace App\Http\Controllers\Distributor;

use App\Http\Controllers\Controller;
use App\Http\Requests\B2B\DistributorPurchaseOrderAddItemRequest;
use App\Http\Requests\B2B\DistributorPurchaseOrderStoreRequest;
use App\Models\DistributorOrder;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DistributorOrderController extends Controller
{
    public function index()
    {
        $distributorId = Auth::guard('distributor')->id();

        $data = DistributorOrder::query()
            ->where('distributor_id', $distributorId)
            ->latest('id')
            ->paginate(15)
            ->through(fn (DistributorOrder $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'subtotal_amount' => $order->subtotal_amount,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at?->format('M d, Y'),
            ]);

        return $this->render('distributor/orders/purchase/index', compact('data'));
    }

    public function create()
    {
        return $this->render('distributor/orders/purchase/create');
    }

    public function store(DistributorPurchaseOrderStoreRequest $request)
    {
        $distributor = Auth::guard('distributor')->user();
        $validated = $request->validated();

        $product = Product::findOrFail((int) $validated['product_id']);
        $unitPrice = (float) ($product->distributor_price ?? $product->price ?? 0);
        $quantity = (int) $validated['quantity'];

        $order = DistributorOrder::create([
            'order_number' => DistributorOrder::generateOrderNumber(),
            'status' => DistributorOrder::STATUS_PENDING,
            'distributor_id' => $distributor->id,
            'placed_by_distributor_id' => $distributor->id,
            'subtotal_amount' => $unitPrice * $quantity,
            'total_amount' => $unitPrice * $quantity,
        ]);

        $order->items()->create([
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'subtotal' => $unitPrice * $quantity,
            'price_source' => 'product_distributor_price',
        ]);

        return redirect()
            ->route('distributor.purchase-orders.show', $order)
            ->with('success', 'Purchase order created. You can add more items or wait for admin approval.');
    }

    public function addItem(DistributorPurchaseOrderAddItemRequest $request, DistributorOrder $purchase_order)
    {
        $distributorId = Auth::guard('distributor')->id();
        abort_unless($purchase_order->distributor_id === $distributorId, 403);
        abort_unless($purchase_order->isPending(), 422, 'Items can only be added to pending orders.');

        $validated = $request->validated();
        $product = Product::findOrFail((int) $validated['product_id']);
        $unitPrice = (float) ($product->distributor_price ?? $product->price ?? 0);
        $quantity = (int) $validated['quantity'];

        $purchase_order->items()->create([
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'subtotal' => $unitPrice * $quantity,
            'price_source' => 'product_distributor_price',
        ]);

        $newTotal = (float) $purchase_order->items()->sum(DB::raw('unit_price * quantity'));
        $purchase_order->update(['subtotal_amount' => $newTotal, 'total_amount' => $newTotal]);

        return redirect()
            ->route('distributor.purchase-orders.show', $purchase_order)
            ->with('success', 'Item added.');
    }

    public function show(DistributorOrder $purchase_order)
    {
        $distributorId = Auth::guard('distributor')->id();
        abort_unless($purchase_order->distributor_id === $distributorId, 403);

        $purchase_order->loadMissing([
            'items.product',
            'payments.recordedByAdmin',
            'payments.media',
        ]);

        $payments = $purchase_order->payments
            ->sortBy('created_at')
            ->map(fn ($payment) => [
                'id' => $payment->id,
                'amount' => (float) $payment->amount,
                'payment_method' => $payment->payment_method,
                'note' => $payment->note,
                'recorded_by_name' => $payment->recordedByAdmin?->name ?? 'Admin',
                'created_at' => $payment->created_at?->format('M d, Y H:i'),
                'payment_proof_url' => $payment->getFirstMediaUrl('payment_proof') ?: null,
            ])
            ->values()
            ->all();

        $data = [
            'id' => $purchase_order->id,
            'order_number' => $purchase_order->order_number,
            'status' => $purchase_order->status,
            'rejection_note' => $purchase_order->rejection_note,
            'subtotal_amount' => $purchase_order->subtotal_amount,
            'total_amount' => $purchase_order->total_amount,
            'items' => $purchase_order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_title' => $item->product?->title,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
            ]),
            'created_at' => $purchase_order->created_at?->format('M d, Y H:i'),
            'payment_summary' => [
                'payment_status' => $purchase_order->payment_status ?? 'unpaid',
                'amount_paid' => (float) ($purchase_order->amount_paid ?? 0),
                'remaining_balance' => (float) $purchase_order->total_amount - (float) ($purchase_order->amount_paid ?? 0),
                'payments' => $payments,
            ],
        ];

        return $this->render('distributor/orders/purchase/show', compact('data'));
    }
}
