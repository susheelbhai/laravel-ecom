<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\B2B\AdminDistributorOrderApproveRequest;
use App\Http\Requests\B2B\AdminDistributorOrderStoreRequest;
use App\Models\Distributor;
use App\Models\DistributorOrder;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\WarehouseRack;
use App\Services\Inventory\DefaultLocationService;
use App\Services\Inventory\StockTransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class DistributorOrderController extends Controller
{
    public function index()
    {
        $data = DistributorOrder::query()
            ->with('distributor:id,name,email')
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
     * Admin-initiated order store (places + immediately transfers stock).
     */
    public function store(AdminDistributorOrderStoreRequest $request, StockTransferService $stockTransfer, DefaultLocationService $defaultLocation): RedirectResponse
    {
        $adminId = Auth::guard('admin')->id();
        abort_unless($adminId, 401);

        $validated = $request->validated();

        try {
            $order = DB::transaction(function () use ($validated, $adminId, $stockTransfer, $defaultLocation) {
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

                    return [
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'subtotal' => $unitPrice * $item['quantity'],
                        'price_source' => $priceSource,
                    ];
                });

                $subtotalAmount = (float) $lineItems->sum('subtotal');

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
                    'total_amount' => $subtotalAmount,
                ]);

                $order->items()->createMany($lineItems->all());

                $toRack = $defaultLocation->ensureDistributorDefaultRack($distributor);

                $stockTransfer->transferStock(
                    $sourceRack->id,
                    $toRack->id,
                    $itemsInput->map(fn ($x) => ['product_id' => $x['product_id'], 'quantity' => $x['quantity']]),
                    $order,
                    "Transfer for distributor order #{$order->order_number}"
                );

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

        return redirect()->route('admin.distributor-orders.show', $order)->with('success', 'Distributor order placed.');
    }

    public function show(DistributorOrder $distributor_order)
    {
        $distributor_order->loadMissing(['items.product', 'distributor', 'sourceWarehouse', 'sourceRack']);

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
            ]),
            'created_at' => $distributor_order->created_at?->format('M d, Y H:i'),
            'approved_at' => $distributor_order->approved_at?->format('M d, Y H:i'),
            'rejected_at' => $distributor_order->rejected_at?->format('M d, Y H:i'),
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

                    $item->update([
                        'quantity' => $newQty,
                        'unit_price' => $unitPrice,
                        'subtotal' => $unitPrice * $newQty,
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
                    'total_amount' => $subtotalAmount,
                ]);

                $toRack = $defaultLocation->ensureDistributorDefaultRack($distributor_order->distributor);

                $stockTransfer->transferStock(
                    $sourceRack->id,
                    $toRack->id,
                    $transferItems,
                    $distributor_order,
                    "Transfer for distributor order #{$distributor_order->order_number}"
                );
            });
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages(['items' => [$e->getMessage()]]);
        }

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

        return redirect()
            ->route('admin.distributor-orders.show', $distributor_order)
            ->with('success', 'Order rejected.');
    }
}
