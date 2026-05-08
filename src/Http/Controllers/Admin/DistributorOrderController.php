<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\SerialNumberMovementServiceInterface;
use App\Events\DistributorOrderApproved;
use App\Events\DistributorOrderCreatedByAdmin;
use App\Events\DistributorOrderRejected;
use App\Http\Controllers\Controller;
use App\Http\Requests\B2B\AdminDistributorOrderApproveRequest;
use App\Http\Requests\B2B\AdminDistributorOrderStoreRequest;
use App\Models\Distributor;
use App\Models\DistributorOrder;
use App\Models\Product;
use App\Models\SerialNumber;
use App\Models\Setting;
use App\Models\Warehouse;
use App\Models\WarehouseRack;
use App\Services\B2BPaymentService;
use App\Services\Inventory\DefaultLocationService;
use App\Services\Inventory\StockTransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class DistributorOrderController extends Controller
{
    public function __construct(
        private readonly SerialNumberMovementServiceInterface $serialNumberMovementService,
    ) {}

    public function index(Request $request)
    {
        $data = DistributorOrder::query()
            ->with('distributor:id,name,email')
            ->when($request->integer('distributor_id'), fn ($q, $id) => $q->where('distributor_id', $id))
            ->latest('id')
            ->paginate(15)
            ->through(fn (DistributorOrder $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'distributor_name' => $order->distributor?->name,
                'distributor_email' => $order->distributor?->email,
                'subtotal_amount' => $order->subtotal_amount,
                'total_amount' => $order->total_amount,
                'payment_status' => $order->isApproved() ? ($order->payment_status ?? 'unpaid') : null,
                'amount_paid' => $order->isApproved() ? (float) ($order->amount_paid ?? 0) : null,
                'remaining_balance' => $order->isApproved() ? max(0.0, (float) $order->total_amount - (float) ($order->amount_paid ?? 0)) : null,
                'created_at' => $order->created_at?->format('M d, Y'),
            ]);

        return $this->render('admin/distributor-orders/index', compact('data'));
    }

    /**
     * Admin-initiated order creation (admin places order on behalf of distributor).
     */
    public function create()
    {
        $distributors = Distributor::query()
            ->select(['id', 'name', 'email'])
            ->where('application_status', Distributor::STATUS_APPROVED)
            ->orderBy('name')
            ->get();

        $sourceWarehouses = Warehouse::query()
            ->where('owner_type', 'admin')
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        $sourceRacks = WarehouseRack::query()
            ->whereIn('warehouse_id', $sourceWarehouses->pluck('id'))
            ->select(['id', 'warehouse_id', 'identifier'])
            ->orderBy('warehouse_id')
            ->orderBy('identifier')
            ->get();

        return $this->render('admin/distributor-orders/create', compact('distributors', 'sourceWarehouses', 'sourceRacks'));
    }

    public function productPricing(Product $product): JsonResponse
    {
        return response()->json([
            'id' => $product->id,
            'distributor_price' => $product->distributor_price ?? $product->price,
        ]);
    }

    /**
     * Return available serial numbers for a product in a given rack.
     * Used by the create/approve forms to populate serial number selectors.
     *
     * GET /admin/distributor-orders/products/{product}/serials?rack_id=X
     */
    public function productSerials(Product $product, Request $request): JsonResponse
    {
        $rackId = $request->integer('rack_id');

        if (! $rackId) {
            return response()->json(['serial_numbers' => []]);
        }

        $serials = SerialNumber::where('product_id', $product->id)
            ->where('rack_id', $rackId)
            ->where('status', 'available')
            ->orderBy('serial_number')
            ->pluck('serial_number');

        return response()->json(['serial_numbers' => $serials]);
    }

    /**
     * Admin-initiated order store (places + immediately transfers stock).
     */
    public function store(AdminDistributorOrderStoreRequest $request, StockTransferService $stockTransfer, DefaultLocationService $defaultLocation, B2BPaymentService $paymentService): RedirectResponse
    {
        $adminId = Auth::guard('admin')->id();
        abort_unless($adminId, 401);

        $validated = $request->validated();

        try {
            $order = DB::transaction(function () use ($validated, $adminId, $stockTransfer, $defaultLocation, $paymentService) {
                $distributor = Distributor::query()->whereKey($validated['distributor_id'])->firstOrFail();
                abort_unless($distributor->isApproved(), 422, 'Distributor is not approved.');

                $sourceRack = WarehouseRack::query()
                    ->with('warehouse:id,owner_type')
                    ->whereKey($validated['source_rack_id'])
                    ->firstOrFail();

                abort_unless(
                    in_array($sourceRack->warehouse?->owner_type, ['admin', null], true),
                    403
                );

                $itemsInput = collect($validated['items'])->map(fn ($row) => [
                    'product_id' => (int) $row['product_id'],
                    'quantity' => (int) $row['quantity'],
                    'unit_price' => $row['unit_price'] ?? null,
                ]);

                /** @var Collection<int,Product> $products */
                $products = Product::query()
                    ->whereIn('id', $itemsInput->pluck('product_id'))
                    ->get()
                    ->keyBy('id');

                $lineItems = $itemsInput->map(function (array $item) use ($products) {
                    $product = $products->get($item['product_id']);
                    abort_unless($product, 422, 'Invalid product in items.');

                    $base = (float) ($product->distributor_price ?? $product->price ?? 0);
                    $override = $item['unit_price'] !== null ? (float) $item['unit_price'] : null;
                    $unitPrice = $override ?? $base;
                    $priceSource = $override !== null ? 'admin_override' : 'product_distributor_price';
                    $gstRate = (float) ($product->gst_rate ?? 0);
                    $itemSubtotal = $unitPrice * $item['quantity'];
                    $itemTax = round($itemSubtotal * $gstRate / 100, 2);

                    return [
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'gst_rate' => $gstRate,
                        'tax_amount' => $itemTax,
                        'subtotal' => $itemSubtotal,
                        'price_source' => $priceSource,
                    ];
                });

                $subtotalAmount = (float) $lineItems->sum('subtotal');
                $taxAmount = (float) $lineItems->sum('tax_amount');

                $order = DistributorOrder::create([
                    'order_number' => DistributorOrder::generateOrderNumber(),
                    'status' => DistributorOrder::STATUS_APPROVED,
                    'distributor_id' => $distributor->id,
                    'source_warehouse_id' => $sourceRack->warehouse_id,
                    'source_rack_id' => $sourceRack->id,
                    'placed_by_admin_id' => $adminId,
                    'approved_by_admin_id' => $adminId,
                    'approved_at' => now(),
                    'subtotal_amount' => $subtotalAmount,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $subtotalAmount + $taxAmount,
                ]);

                $order->items()->createMany($lineItems->all());

                // Build serial numbers map keyed by product_id for the transfer service.
                $serialNumbersByProductId = [];
                foreach ($validated['items'] as $itemInput) {
                    $serials = $itemInput['serial_numbers'] ?? [];
                    if (! empty($serials)) {
                        $serialNumbersByProductId[(int) $itemInput['product_id']] = $serials;
                    }
                }

                $toRack = $defaultLocation->ensureDistributorDefaultRack($distributor);

                // Transfer stock first (updates rack_id on serial numbers and stock records).
                $stockTransfer->transferStock(
                    $sourceRack->id,
                    $toRack->id,
                    $itemsInput->map(fn ($x) => ['product_id' => $x['product_id'], 'quantity' => $x['quantity']]),
                    $order,
                    "Transfer for distributor order #{$order->order_number}",
                    $serialNumbersByProductId,
                );

                // Then record the pivot rows and distributor_order movements.
                $createdItems = $order->items()->get()->keyBy('product_id');
                foreach ($validated['items'] as $itemInput) {
                    $serialNumbers = $itemInput['serial_numbers'] ?? [];
                    if (empty($serialNumbers)) {
                        continue;
                    }
                    $orderItem = $createdItems->get((int) $itemInput['product_id']);
                    if ($orderItem) {
                        $this->serialNumberMovementService->validateAndAssign(
                            serialNumbers: $serialNumbers,
                            productId: (int) $itemInput['product_id'],
                            orderItem: $orderItem,
                            eventType: 'distributor_order',
                            actor: Auth::guard('admin')->user(),
                        );
                    }
                }

                // Record initial payment if provided
                $paymentStatusInput = $validated['payment_status'] ?? null;
                if ($paymentStatusInput && $paymentStatusInput !== 'unpaid') {
                    $admin = Auth::guard('admin')->user();
                    $paymentData = [
                        'amount' => $paymentStatusInput === 'paid'
                            ? $subtotalAmount
                            : (float) ($validated['amount_paid'] ?? 0),
                        'payment_method' => $validated['payment_method'],
                        'note' => $validated['note'] ?? null,
                        'payment_proof' => $validated['payment_proof'] ?? null,
                    ];
                    $paymentService->recordDistributorOrderPayment($order, $paymentData, $admin);
                }

                return $order;
            });
        } catch (RuntimeException $e) {
            $msg = $e->getMessage();
            $messages = ['items' => [$msg]];

            if (preg_match('/product\s+(\d+)/i', $msg, $m)) {
                $productId = (int) $m[1];
                foreach ($validated['items'] as $idx => $row) {
                    if ((int) ($row['product_id'] ?? 0) === $productId) {
                        $messages["items.$idx.quantity"] = [$msg];
                        break;
                    }
                }
            }

            throw ValidationException::withMessages($messages);
        }

        DistributorOrderCreatedByAdmin::dispatch($order, Auth::guard('admin')->user());

        return redirect()->route('admin.distributor-orders.show', $order)->with('success', 'Distributor order placed.');
    }

    public function show(DistributorOrder $distributor_order)    {
        $distributor_order->loadMissing([
            'items.product',
            'distributor',
            'sourceWarehouse',
            'sourceRack',
            'items.serialNumbers:id,serial_number',
            'payments.recordedByAdmin',
            'payments.media',
        ]);

        $payments = $distributor_order->payments
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
            'id' => $distributor_order->id,
            'order_number' => $distributor_order->order_number,
            'status' => $distributor_order->status,
            'rejection_note' => $distributor_order->rejection_note,
            'distributor' => $distributor_order->distributor ? [
                'id' => $distributor_order->distributor->id,
                'name' => $distributor_order->distributor->name,
                'email' => $distributor_order->distributor->email,
            ] : null,
            'source_warehouse' => $distributor_order->sourceWarehouse ? [
                'id' => $distributor_order->sourceWarehouse->id,
                'name' => $distributor_order->sourceWarehouse->name,
            ] : null,
            'source_rack' => $distributor_order->sourceRack ? [
                'id' => $distributor_order->sourceRack->id,
                'identifier' => $distributor_order->sourceRack->identifier,
            ] : null,
            'subtotal_amount' => $distributor_order->subtotal_amount,
            'total_amount' => $distributor_order->total_amount,
            'items' => $distributor_order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_title' => $item->product?->title,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
                'price_source' => $item->price_source,
                'serial_numbers' => $item->serialNumbers->pluck('serial_number')->all(),
            ]),
            'created_at' => $distributor_order->created_at?->format('M d, Y H:i'),
            'approved_at' => $distributor_order->approved_at?->format('M d, Y H:i'),
            'rejected_at' => $distributor_order->rejected_at?->format('M d, Y H:i'),
            'payment_summary' => [
                'payment_status' => $distributor_order->isApproved() ? ($distributor_order->payment_status ?? 'unpaid') : null,
                'amount_paid' => $distributor_order->isApproved() ? (float) ($distributor_order->amount_paid ?? 0) : null,
                'remaining_balance' => $distributor_order->isApproved() ? max(0.0, (float) $distributor_order->total_amount - (float) ($distributor_order->amount_paid ?? 0)) : null,
                'payments' => $distributor_order->isApproved() ? $payments : [],
            ],
        ];

        return $this->render('admin/distributor-orders/show', compact('data'));
    }

    /**
     * Show the approve form — admin picks source rack and can adjust quantities/prices.
     */
    public function approveForm(DistributorOrder $distributor_order)
    {
        abort_unless($distributor_order->isPending(), 422, 'Only pending orders can be approved.');

        $distributor_order->loadMissing(['items.product', 'distributor']);

        $sourceWarehouses = Warehouse::query()
            ->where('owner_type', 'admin')
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        $sourceRacks = WarehouseRack::query()
            ->whereIn('warehouse_id', $sourceWarehouses->pluck('id'))
            ->select(['id', 'warehouse_id', 'identifier'])
            ->orderBy('warehouse_id')
            ->orderBy('identifier')
            ->get();

        $data = [
            'id' => $distributor_order->id,
            'order_number' => $distributor_order->order_number,
            'distributor' => [
                'id' => $distributor_order->distributor?->id,
                'name' => $distributor_order->distributor?->name,
            ],
            'items' => $distributor_order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_title' => $item->product?->title,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
            ]),
            'subtotal_amount' => $distributor_order->subtotal_amount,
            'total_amount' => $distributor_order->total_amount,
        ];

        return $this->render('admin/distributor-orders/approve', compact('data', 'sourceWarehouses', 'sourceRacks'));
    }

    /**
     * Approve a distributor-placed order: pick source rack, optionally adjust items, transfer stock.
     */
    public function approve(AdminDistributorOrderApproveRequest $request, DistributorOrder $distributor_order, StockTransferService $stockTransfer, DefaultLocationService $defaultLocation): RedirectResponse
    {
        if (! $distributor_order->isPending()) {
            throw ValidationException::withMessages([
                'source_rack_id' => ['Only pending orders can be approved.'],
            ]);
        }

        $adminId = Auth::guard('admin')->id();
        $validated = $request->validated();

        // Validate source rack belongs to admin before entering the transaction.
        $sourceRack = WarehouseRack::query()
            ->with('warehouse:id,owner_type')
            ->whereKey($validated['source_rack_id'])
            ->firstOrFail();

        if (! in_array($sourceRack->warehouse?->owner_type, ['admin', null], true)) {
            throw ValidationException::withMessages([
                'source_rack_id' => ['The selected rack does not belong to an admin warehouse.'],
            ]);
        }

        // Validate that all submitted item IDs belong to this order.
        $orderItemIds = $distributor_order->items->pluck('id')->all();
        $submittedIds = collect($validated['items'])->pluck('id')->map(fn ($id) => (int) $id)->all();
        $invalidIds = array_diff($submittedIds, $orderItemIds);

        if (! empty($invalidIds)) {
            throw ValidationException::withMessages([
                'items' => ['One or more items do not belong to this order.'],
            ]);
        }

        try {
            DB::transaction(function () use ($validated, $adminId, $sourceRack, $distributor_order, $stockTransfer, $defaultLocation) {
                // Reload items fresh inside the transaction.
                $items = $distributor_order->items()->get()->keyBy('id');
                $itemUpdates = collect($validated['items'])->keyBy('id');
                $transferItems = collect();

                foreach ($items as $item) {
                    $update = $itemUpdates->get($item->id);
                    if (! $update) {
                        continue;
                    }

                    $newQty = (int) $update['quantity'];
                    $override = isset($update['unit_price']) && $update['unit_price'] !== null
                        ? (float) $update['unit_price']
                        : null;

                    $unitPrice = $override ?? (float) $item->unit_price;
                    $priceSource = $override !== null ? 'admin_override' : $item->price_source;
                    $gstRate = (float) ($item->gst_rate ?? 0);
                    $itemSubtotal = $unitPrice * $newQty;
                    $itemTax = round($itemSubtotal * $gstRate / 100, 2);

                    $item->update([
                        'quantity' => $newQty,
                        'unit_price' => $unitPrice,
                        'gst_rate' => $gstRate,
                        'tax_amount' => $itemTax,
                        'subtotal' => $itemSubtotal,
                        'price_source' => $priceSource,
                    ]);

                    $transferItems->push([
                        'product_id' => $item->product_id,
                        'quantity' => $newQty,
                    ]);
                }

                $subtotalAmount = (float) $distributor_order->items()->sum(
                    DB::raw('unit_price * quantity')
                );
                $taxAmount = (float) $distributor_order->items()->sum('tax_amount');

                $distributor_order->update([
                    'status' => DistributorOrder::STATUS_APPROVED,
                    'source_rack_id' => $sourceRack->id,
                    'source_warehouse_id' => $sourceRack->warehouse_id,
                    'approved_by_admin_id' => $adminId,
                    'approved_at' => now(),
                    'rejected_by_admin_id' => null,
                    'rejected_at' => null,
                    'rejection_note' => null,
                    'subtotal_amount' => $subtotalAmount,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $subtotalAmount + $taxAmount,
                ]);

                $toRack = $defaultLocation->ensureDistributorDefaultRack($distributor_order->distributor);

                // Build serial numbers map for the transfer service.
                $serialNumbersByProductId = [];
                foreach ($validated['items'] as $itemInput) {
                    $serials = $itemInput['serial_numbers'] ?? [];
                    if (! empty($serials)) {
                        $orderItem = $items->get((int) $itemInput['id']);
                        if ($orderItem) {
                            $serialNumbersByProductId[$orderItem->product_id] = $serials;
                        }
                    }
                }

                // Transfer stock first (updates rack_id on serial numbers and stock records).
                $stockTransfer->transferStock(
                    $sourceRack->id,
                    $toRack->id,
                    $transferItems,
                    $distributor_order,
                    "Transfer for distributor order #{$distributor_order->order_number}",
                    $serialNumbersByProductId,
                );

                // Then record the pivot rows and distributor_order movements.
                foreach ($validated['items'] as $itemInput) {
                    $serialNumbers = $itemInput['serial_numbers'] ?? [];
                    if (empty($serialNumbers)) {
                        continue;
                    }
                    $orderItem = $items->get((int) $itemInput['id']);
                    if ($orderItem) {
                        $this->serialNumberMovementService->validateAndAssign(
                            serialNumbers: $serialNumbers,
                            productId: $orderItem->product_id,
                            orderItem: $orderItem,
                            eventType: 'distributor_order',
                            actor: Auth::guard('admin')->user(),
                        );
                    }
                }
            });
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages(['items' => [$e->getMessage()]]);
        }

        DistributorOrderApproved::dispatch($distributor_order, Auth::guard('admin')->user());

        return redirect()
            ->route('admin.distributor-orders.show', $distributor_order)
            ->with('success', 'Order approved and stock transferred.');
    }

    /**
     * Reject a pending distributor order.
     */
    public function reject(Request $request, DistributorOrder $distributor_order): RedirectResponse
    {
        if (! $distributor_order->isPending()) {
            throw ValidationException::withMessages([
                'rejection_note' => ['Only pending orders can be rejected.'],
            ]);
        }

        $validated = $request->validate([
            'rejection_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $distributor_order->update([
            'status' => DistributorOrder::STATUS_REJECTED,
            'rejected_by_admin_id' => Auth::guard('admin')->id(),
            'rejected_at' => now(),
            'rejection_note' => $validated['rejection_note'] ?? null,
            'approved_by_admin_id' => null,
            'approved_at' => null,
        ]);

        DistributorOrderRejected::dispatch($distributor_order, Auth::guard('admin')->user());

        return redirect()
            ->route('admin.distributor-orders.show', $distributor_order)
            ->with('success', 'Order rejected.');
    }

    /**
     * Render a printable invoice for an approved distributor order.
     */
    public function invoice(DistributorOrder $distributor_order): Response
    {
        abort_unless($distributor_order->isApproved(), 404, 'Invoice is only available for approved orders.');

        $distributor_order->loadMissing([
            'items.product',
            'distributor.state',
            'sourceWarehouse.state',
            'payments',
            'placedByAdmin',
            'approvedByAdmin',
        ]);

        $setting = Setting::with('state')->first();

        return response()->view('printable.distributor-order-invoice', [
            'order' => $distributor_order,
            'setting' => $setting,
        ]);
    }
}
