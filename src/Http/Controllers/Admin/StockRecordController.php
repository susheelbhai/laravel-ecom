<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\SerialNumberMovementServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdjustQuantityRequest;
use App\Http\Requests\MoveStockRecordRequest;
use App\Http\Requests\StoreStockRecordRequest;
use App\Http\Requests\UpdateStockRecordRequest;
use App\Models\Product;
use App\Models\SerialNumber;
use App\Models\StockMovement;
use App\Models\StockRecord;
use App\Models\Warehouse;
use App\Services\Inventory\StockTransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StockRecordController extends Controller
{
    public function __construct(
        private readonly SerialNumberMovementServiceInterface $serialNumberMovementService,
    ) {}

    /**
     * Display a listing of stock records.
     */
    public function index()
    {
        $warehouseId = request()->integer('warehouse_id');
        $productId = request()->integer('product_id');
        $stockStatus = request('stock_status');
        $search = trim((string) request('search', ''));

        $query = StockRecord::query()
            ->select(['id', 'product_id', 'rack_id', 'quantity', 'created_at', 'updated_at'])
            ->with([
                'product:id,title,sku',
                'rack:id,warehouse_id,identifier',
                'rack.warehouse:id,name',
            ])
            // Only show stock in admin-owned warehouses — distributor/dealer stock
            // has its own dedicated menu entries and must not appear here.
            ->whereHas('rack.warehouse', fn ($q) => $q->where('owner_type', 'admin'));

        // Filter by warehouse
        $query->when($warehouseId, function ($q) use ($warehouseId) {
            $q->whereHas('rack', fn ($rack) => $rack->where('warehouse_id', $warehouseId));
        });

        // Filter by product
        $query->when($productId, fn ($q) => $q->where('product_id', $productId));

        // Filter by stock status
        $query->when($stockStatus, fn ($q) => $q->byStockStatus($stockStatus));

        // Search by product name or SKU
        $query->when($search !== '', function ($q) use ($search) {
            // Avoid a correlated whereHas() for search; filter by matching product ids.
            $q->whereIn('product_id', Product::query()
                ->select('id')
                ->where('title', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%"));
        });

        // simplePaginate avoids an expensive count(*) on large datasets.
        $stockRecords = $query
            ->orderByDesc('id')
            ->simplePaginate(15)
            ->withQueryString();

        // Collect all rack+product combos to batch-load serial numbers in one query.
        $stockRecords->each(fn ($r) => null); // force collection load before through()
        $rackProductPairs = $stockRecords->getCollection()->map(
            fn ($r) => ['product_id' => $r->product_id, 'rack_id' => $r->rack_id]
        );

        $serialsByRackProduct = SerialNumber::where('status', 'available')
            ->whereIn('product_id', $rackProductPairs->pluck('product_id')->unique())
            ->whereIn('rack_id', $rackProductPairs->pluck('rack_id')->unique())
            ->orderBy('serial_number')
            ->get(['serial_number', 'product_id', 'rack_id'])
            ->groupBy(fn ($s) => $s->product_id.'_'.$s->rack_id);

        $stockRecords->through(function (StockRecord $record) use ($serialsByRackProduct) {
            $record->product?->withoutAppends();
            $key = $record->product_id.'_'.$record->rack_id;
            $serials = ($serialsByRackProduct[$key] ?? collect())->pluck('serial_number')->all();

            return [
                'id' => $record->id,
                'product' => $record->product ? [
                    'id' => $record->product->id,
                    'title' => $record->product->title,
                    'sku' => $record->product->sku,
                ] : null,
                'rack' => $record->rack ? [
                    'id' => $record->rack->id,
                    'identifier' => $record->rack->identifier,
                    'warehouse' => $record->rack->warehouse ? [
                        'id' => $record->rack->warehouse->id,
                        'name' => $record->rack->warehouse->name,
                    ] : null,
                ] : null,
                'quantity' => $record->quantity,
                'serial_numbers' => $serials,
                'serial_count' => count($serials),
            ];
        });

        return $this->render('admin/resources/stock_record/index', [
            'stockRecords' => $stockRecords,
            'warehouses' => $this->warehouseOptionsForSelect(),
            'filters' => [
                'warehouse_id' => $warehouseId,
                'product_id' => $productId,
                'stock_status' => $stockStatus,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new stock record.
     */
    public function create()
    {
        return $this->render('admin/resources/stock_record/create', [
            'warehouses' => $this->warehousesWithRacksForSelect(),
        ]);
    }

    /**
     * Store a newly created stock record in storage.
     */
    public function store(StoreStockRecordRequest $request)
    {
        $stockRecord = StockRecord::getOrCreateForRack($request->product_id, $request->rack_id);

        // Create stock movement
        $movement = StockMovement::create([
            'product_id' => $request->product_id,
            'rack_id' => $request->rack_id,
            'type' => 'in',
            'quantity' => $request->quantity,
            'reason' => 'Initial stock entry',
            'created_by' => Auth::guard('admin')->id(),
        ]);

        // Save serial numbers if provided
        $serials = $request->input('serial_numbers', []);
        foreach ($serials as $serial) {
            $serialRecord = SerialNumber::create([
                'product_id' => $request->product_id,
                'rack_id' => $request->rack_id,
                'stock_movement_id' => $movement->id,
                'serial_number' => $serial,
                'status' => 'available',
            ]);

            $this->serialNumberMovementService->recordMovement(
                serialNumber: $serialRecord,
                eventType: 'stock_in',
                reference: $movement,
                actor: Auth::guard('admin')->user(),
            );
        }

        // Recalculate stock record quantity
        $stockRecord->recalculateQuantity();

        return redirect()->route('admin.stock.records.index')
            ->with('success', 'Stock added successfully.');
    }

    /**
     * Show the form for editing the specified stock record.
     */
    public function edit(StockRecord $record)
    {
        $this->loadStockRecordForInertia($record);

        return $this->render('admin/resources/stock_record/edit', [
            'stockRecord' => $record,
        ]);
    }

    /**
     * Update the specified stock record in storage.
     */
    public function update(UpdateStockRecordRequest $request, StockRecord $record)
    {
        $serialCount = SerialNumber::where('product_id', $record->product_id)
            ->where('rack_id', $record->rack_id)
            ->count();

        if ($serialCount > 0) {
            $nonSerialQty = max(0, $record->quantity - $serialCount);
            $message = $nonSerialQty > 0
                ? "This rack has {$serialCount} serialised unit(s) and {$nonSerialQty} non-serialised unit(s) of this product — mixing is not allowed. Resolve the data inconsistency first, then use Mark as Damaged, Mark as Stolen, or the retail sale flow to manage individual serialised units."
                : 'Direct quantity edits are not allowed for serialised products. Use Mark as Damaged, Mark as Stolen, or the retail sale flow to manage individual units.';

            return redirect()->back()->withErrors(['quantity' => $message]);
        }

        $oldQuantity = $record->quantity;
        $newQuantity = $request->quantity;
        $difference = $newQuantity - $oldQuantity;

        if ($difference != 0) {
            StockMovement::create([
                'product_id' => $record->product_id,
                'rack_id' => $record->rack_id,
                'type' => 'adjustment',
                'quantity' => $difference,
                'reason' => 'Manual quantity adjustment',
                'created_by' => Auth::guard('admin')->id(),
            ]);

            $record->recalculateQuantity();
        }

        return redirect()->route('admin.stock.records.index')
            ->with('success', 'Stock record updated successfully.');
    }

    /**
     * Remove the specified stock record from storage.
     */
    public function destroy(StockRecord $record)
    {
        $record->delete();

        return redirect()->route('admin.stock.records.index')
            ->with('success', 'Stock record deleted successfully.');
    }

    /**
     * Show the form for moving a stock record.
     */
    public function showMoveForm(StockRecord $record)
    {
        $this->loadStockRecordForInertia($record);

        // Pass available serial numbers in this rack so the move form can show checkboxes.
        $serialNumbers = SerialNumber::where('product_id', $record->product_id)
            ->where('rack_id', $record->rack_id)
            ->where('status', 'available')
            ->orderBy('serial_number')
            ->get(['id', 'serial_number'])
            ->map(fn (SerialNumber $s) => [
                'id' => $s->id,
                'serial_number' => $s->serial_number,
            ])
            ->all();

        return $this->render('admin/resources/stock_record/move', [
            'stockRecord' => $record,
            'warehouses' => $this->warehousesWithRacksForSelect(),
            'availableSerialNumbers' => $serialNumbers,
        ]);
    }

    /**
     * Show the form for adjusting stock quantity.
     */
    public function showAdjustForm(StockRecord $record)
    {
        $this->loadStockRecordForInertia($record);

        return $this->render('admin/resources/stock_record/adjust', [
            'stockRecord' => $record,
        ]);
    }

    /**
     * Move stock record to a different rack.
     */
    public function move(MoveStockRecordRequest $request, StockRecord $record, StockTransferService $stockTransfer)
    {
        $quantityToMove = $request->quantity;
        $reason = $request->reason ?? 'Stock transfer between racks';

        // Build serial numbers map for the transfer service.
        $serialNumbersByProductId = [];
        $selectedSerials = $request->input('serial_numbers', []);

        if (! empty($selectedSerials)) {
            $serialNumbersByProductId[$record->product_id] = $selectedSerials;
        }

        // Use a throwaway reference model — the StockTransferService creates its own StockMovements.
        // We pass the StockRecord itself as the reference.
        $stockTransfer->transferStock(
            fromRackId: $record->rack_id,
            toRackId: $request->rack_id,
            items: collect([['product_id' => $record->product_id, 'quantity' => $quantityToMove]]),
            reference: $record,
            reason: $reason,
            serialNumbersByProductId: $serialNumbersByProductId,
        );

        return redirect()->route('admin.stock.records.index')
            ->with('success', 'Stock moved successfully.');
    }

    /**
     * Adjust the quantity of a stock record.
     */
    public function adjustQuantity(AdjustQuantityRequest $request, StockRecord $record)
    {
        $serialCount = SerialNumber::where('product_id', $record->product_id)
            ->where('rack_id', $record->rack_id)
            ->count();

        if ($serialCount > 0) {
            $nonSerialQty = max(0, $record->quantity - $serialCount);
            $message = $nonSerialQty > 0
                ? "This rack has {$serialCount} serialised unit(s) and {$nonSerialQty} non-serialised unit(s) of this product — mixing is not allowed. Resolve the data inconsistency first, then use Mark as Damaged, Mark as Stolen, or the retail sale flow to manage individual serialised units."
                : 'Quantity adjustments are not allowed for serialised products. Use Mark as Damaged, Mark as Stolen, or the retail sale flow to manage individual units.';

            return response()->json(['message' => $message], 422);
        }

        StockMovement::create([
            'product_id' => $record->product_id,
            'rack_id' => $record->rack_id,
            'type' => 'adjustment',
            'quantity' => $request->adjustment,
            'reason' => $request->reason ?? 'Manual adjustment',
            'created_by' => Auth::guard('admin')->id(),
        ]);

        $record->recalculateQuantity();

        return redirect()->route('admin.stock.records.index')
            ->with('success', 'Stock quantity adjusted successfully.');
    }

    /**
     * Show stock movement history for a record.
     */
    public function history(StockRecord $record)
    {
        $this->loadStockRecordForInertia($record);

        $movements = StockMovement::where('product_id', $record->product_id)
            ->where('rack_id', $record->rack_id)
            ->with(['createdBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return $this->render('admin/resources/stock_record/history', [
            'stockRecord' => $record,
            'movements' => $movements,
        ]);
    }

    private function loadStockRecordForInertia(StockRecord $record): void
    {
        $record->load([
            'product:id,title,sku',
            'rack:id,warehouse_id,identifier',
            'rack.warehouse:id,name',
        ]);

        $record->product?->withoutAppends();
    }

    /**
     * Lazy product search for async selects (title/SKU). Query: q (min 2 chars).
     *
     * @return JsonResponse
     */
    public function searchProducts(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        $escaped = '%'.addcslashes($q, '%_\\').'%';

        $products = Product::query()
            ->select(['id', 'title', 'sku'])
            ->where(function ($query) use ($escaped) {
                $query->where('title', 'like', $escaped)
                    ->orWhere('sku', 'like', $escaped);
            })
            ->orderBy('title')
            ->limit(30)
            ->get();

        return response()->json([
            'results' => $products->map(fn (Product $p) => [
                'id' => $p->id,
                'label' => $p->sku ? "{$p->title} ({$p->sku})" : $p->title,
            ]),
        ]);
    }

    /**
     * @return array<int, array{id: int, name: string, racks: array<int, array{id: int, name: string}>}>
     */
    private function warehousesWithRacksForSelect(): array
    {
        return Warehouse::query()
            ->where('owner_type', 'admin')
            ->select(['id', 'name'])
            ->with([
                'racks' => fn ($q) => $q
                    ->select(['id', 'warehouse_id', 'identifier'])
                    ->orderBy('identifier'),
            ])
            ->orderBy('name')
            ->get()
            ->map(fn (Warehouse $w) => [
                'id' => $w->id,
                'name' => $w->name,
                'racks' => $w->racks->map(fn ($r) => [
                    'id' => $r->id,
                    'name' => $r->identifier,
                ])->all(),
            ])
            ->all();
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function warehouseOptionsForSelect(): array
    {
        return Warehouse::query()
            ->where('owner_type', 'admin')
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get()
            ->map(fn (Warehouse $w) => [
                'id' => $w->id,
                'name' => $w->name,
            ])
            ->all();
    }
}
