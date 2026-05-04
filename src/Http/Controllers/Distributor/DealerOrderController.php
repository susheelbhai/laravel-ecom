<?php

namespace App\Http\Controllers\Distributor;

use App\Http\Controllers\Controller;
use App\Http\Requests\B2B\DealerSaleOrderStoreRequest;
use App\Models\Dealer;
use App\Models\DealerOrder;
use App\Models\Product;
use App\Services\Inventory\DefaultLocationService;
use App\Services\Inventory\StockTransferService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class DealerOrderController extends Controller
{
    public function index()
    {
        $distributorId = Auth::guard('distributor')->id();

        $data = DealerOrder::query()
            ->where('distributor_id', $distributorId)
            ->with('dealer:id,name,email')
            ->latest('id')
            ->paginate(15)
            ->through(fn (DealerOrder $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'dealer_name' => $order->dealer?->name,
                'subtotal_amount' => $order->subtotal_amount,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at?->format('M d, Y'),
            ]);

        return $this->render('distributor/orders/dealer/index', compact('data'));
    }

    public function create()
    {
        $distributorId = Auth::guard('distributor')->id();

        $dealers = Dealer::query()
            ->where('distributor_id', $distributorId)
            ->where('application_status', Dealer::STATUS_APPROVED)
            ->select(['id', 'name', 'email'])
            ->orderBy('name')
            ->get();

        return $this->render('distributor/orders/dealer/create', compact('dealers'));
    }

    public function store(DealerSaleOrderStoreRequest $request, StockTransferService $stockTransfer, DefaultLocationService $defaultLocation): RedirectResponse
    {
        $distributor = Auth::guard('distributor')->user();
        abort_unless($distributor, 401);

        $validated = $request->validated();

        try {
            $order = DB::transaction(function () use ($validated, $distributor, $stockTransfer, $defaultLocation) {
                $dealer = Dealer::query()->whereKey($validated['dealer_id'])->firstOrFail();
                abort_unless($dealer->distributor_id === $distributor->id, 403);
                if (! $dealer->isApproved()) {
                    abort(422, 'Dealer is not approved.');
                }

                $product = Product::findOrFail((int) $validated['product_id']);
                $base = (float) ($product->distributor_price ?? $product->price ?? 0);
                $override = isset($validated['unit_price']) && $validated['unit_price'] !== null
                    ? (float) $validated['unit_price']
                    : null;
                $unitPrice = $override ?? $base;
                $quantity = (int) $validated['quantity'];
                $subtotal = $unitPrice * $quantity;

                $order = DealerOrder::create([
                    'order_number' => DealerOrder::generateOrderNumber(),
                    'status' => 'placed',
                    'distributor_id' => $distributor->id,
                    'dealer_id' => $dealer->id,
                    'placed_by_distributor_id' => $distributor->id,
                    'subtotal_amount' => $subtotal,
                    'total_amount' => $subtotal,
                ]);

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'price_source' => $override !== null ? 'distributor_override' : 'product_distributor_price',
                ]);

                $fromRack = $defaultLocation->ensureDistributorDefaultRack($distributor);
                $toRack = $defaultLocation->ensureDealerDefaultRack($dealer);

                $stockTransfer->transferStock(
                    $fromRack->id,
                    $toRack->id,
                    collect([['product_id' => $product->id, 'quantity' => $quantity]]),
                    $order,
                    "Transfer for dealer order #{$order->order_number}"
                );

                return $order;
            });
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages(['product_id' => [$e->getMessage()]]);
        }

        return redirect()->route('distributor.dealer-orders.show', $order)->with('success', 'Dealer order placed.');
    }

    public function show(DealerOrder $dealer_order)
    {
        $distributorId = Auth::guard('distributor')->id();
        abort_unless($dealer_order->distributor_id === $distributorId, 403);

        $dealer_order->loadMissing(['items.product', 'dealer']);

        $data = [
            'id' => $dealer_order->id,
            'order_number' => $dealer_order->order_number,
            'status' => $dealer_order->status,
            'dealer' => [
                'id' => $dealer_order->dealer?->id,
                'name' => $dealer_order->dealer?->name,
                'email' => $dealer_order->dealer?->email,
            ],
            'subtotal_amount' => $dealer_order->subtotal_amount,
            'total_amount' => $dealer_order->total_amount,
            'items' => $dealer_order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_title' => $item->product?->title,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
                'price_source' => $item->price_source,
            ]),
            'created_at' => $dealer_order->created_at?->format('M d, Y H:i'),
        ];

        return $this->render('distributor/orders/dealer/show', compact('data'));
    }
}
