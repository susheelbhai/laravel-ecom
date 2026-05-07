<?php

namespace App\Http\Controllers\Distributor;

use App\Contracts\SerialNumberMovementServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\B2B\DealerSaleOrderStoreRequest;
use App\Models\Dealer;
use App\Models\DealerOrder;
use App\Models\Product;
use App\Models\SerialNumber;
use App\Services\B2BPaymentService;
use App\Services\Inventory\DefaultLocationService;
use App\Services\Inventory\StockTransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class DealerOrderController extends Controller
{
    public function __construct(
        private readonly SerialNumberMovementServiceInterface $serialNumberMovementService,
    ) {}

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
                'payment_status' => $order->payment_status ?? 'unpaid',
                'amount_paid' => (float) ($order->amount_paid ?? 0),
                'remaining_balance' => (float) $order->total_amount - (float) ($order->amount_paid ?? 0),
                'created_at' => $order->created_at?->format('M d, Y'),
            ]);

        return $this->render('distributor/orders/dealer/index', compact('data'));
    }

    public function create()
    {
        $distributorId = Auth::guard('distributor')->id();
        $distributor = Auth::guard('distributor')->user();

        $dealers = Dealer::query()
            ->where('distributor_id', $distributorId)
            ->where('application_status', Dealer::STATUS_APPROVED)
            ->select(['id', 'name', 'email'])
            ->orderBy('name')
            ->get();

        $commissionPercentage = (float) ($distributor->commission_percentage ?? 0);

        return $this->render('distributor/orders/dealer/create', compact('dealers', 'commissionPercentage'));
    }

    /**
     * Return available serial numbers for a product in the distributor's default rack.
     *
     * GET /distributor/products/{product}/serials
     */
    public function productSerials(Product $product, Request $request, DefaultLocationService $defaultLocation): JsonResponse
    {
        $distributor = Auth::guard('distributor')->user();
        $rack = $defaultLocation->ensureDistributorDefaultRack($distributor);

        $serials = SerialNumber::where('product_id', $product->id)
            ->where('rack_id', $rack->id)
            ->where('status', 'available')
            ->orderBy('serial_number')
            ->pluck('serial_number');

        return response()->json(['serial_numbers' => $serials]);
    }

    public function store(DealerSaleOrderStoreRequest $request, StockTransferService $stockTransfer, DefaultLocationService $defaultLocation, B2BPaymentService $paymentService): RedirectResponse
    {
        $distributor = Auth::guard('distributor')->user();
        abort_unless($distributor, 401);

        $validated = $request->validated();

        try {
            $order = DB::transaction(function () use ($validated, $distributor, $stockTransfer, $defaultLocation, $paymentService) {
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

                // Build serial numbers map for the transfer service.
                $serialNumbers = $validated['serial_numbers'] ?? [];
                $serialNumbersByProductId = [];
                if (! empty($serialNumbers)) {
                    $serialNumbersByProductId[$product->id] = $serialNumbers;
                }

                $fromRack = $defaultLocation->ensureDistributorDefaultRack($distributor);
                $toRack = $defaultLocation->ensureDealerDefaultRack($dealer);

                // Transfer stock first (updates rack_id on serial numbers).
                $stockTransfer->transferStock(
                    $fromRack->id,
                    $toRack->id,
                    collect([['product_id' => $product->id, 'quantity' => $quantity]]),
                    $order,
                    "Transfer for dealer order #{$order->order_number}",
                    $serialNumbersByProductId,
                );

                // Then record pivot rows and dealer_order movements.
                if (! empty($serialNumbers)) {
                    $orderItem = $order->items()->first();
                    $this->serialNumberMovementService->validateAndAssign(
                        serialNumbers: $serialNumbers,
                        productId: $product->id,
                        orderItem: $orderItem,
                        eventType: 'dealer_order',
                        actor: $distributor,
                    );
                }

                // Record initial payment if provided
                $paymentStatusInput = $validated['payment_status'] ?? null;
                if ($paymentStatusInput && $paymentStatusInput !== 'unpaid') {
                    $paymentData = [
                        'amount' => $paymentStatusInput === 'paid'
                            ? $subtotal
                            : (float) ($validated['amount_paid'] ?? 0),
                        'payment_method' => $validated['payment_method'],
                        'note' => $validated['note'] ?? null,
                        'payment_proof' => $validated['payment_proof'] ?? null,
                    ];
                    $paymentService->recordDealerOrderPayment($order, $paymentData, $distributor);
                }

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

        $dealer_order->loadMissing([
            'items.product',
            'dealer',
            'payments.recordedByDistributor',
            'payments.media',
        ]);

        $payments = $dealer_order->payments
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
            'payment_summary' => [
                'payment_status' => $dealer_order->payment_status ?? 'unpaid',
                'amount_paid' => (float) ($dealer_order->amount_paid ?? 0),
                'remaining_balance' => (float) $dealer_order->total_amount - (float) ($dealer_order->amount_paid ?? 0),
                'payments' => $payments,
            ],
        ];

        return $this->render('distributor/orders/dealer/show', compact('data'));
    }
}
