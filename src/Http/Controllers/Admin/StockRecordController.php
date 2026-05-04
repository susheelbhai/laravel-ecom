<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdjustQuantityRequest;
use App\Http\Requests\MoveStockRecordRequest;
use App\Http\Requests\StoreStockRecordRequest;
use App\Http\Requests\UpdateStockRecordRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\StockRecord;
use App\Models\Warehouse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockRecordController extends Controller
{
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
            ]);

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

        $stockRecords->through(function (StockRecord $record) {
            $record->product?->withoutAppends();

            return $record;
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
        ], 'inertia');
    }

    /**
     * Show the form for creating a new stock record.
     */
    public function create()
    {
        return $this->render('admin/resources/stock_record/create', [
            'warehouses' => $this->warehousesWithRacksForSelect(),
        ], 'inertia');
    }

    /**
     * Store a newly created stock record in storage.
     */
    public function store(StoreStockRecordRequest $request)
    {
        $stockRecord = StockRecord::getOrCreateForRack($request->product_id, $request->rack_id);

        // Create stock movement
        StockMovement::create([
            'product_id' => $request->product_id,
            'rack_id' => $request->rack_id,
            'type' => 'in',
            'quantity' => $request->quantity,
            'reason' => 'Initial stock entry',
            'created_by' => auth('admin')->id(),
        ]);

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
        ], 'inertia');
    }

    /**
     * Update the specified stock record in storage.
     */
    public function update(UpdateStockRecordRequest $request, StockRecord $record)
    {
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
                'created_by' => auth('admin')->id(),
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

        return $this->render('admin/resources/stock_record/move', [
            'stockRecord' => $record,
            'warehouses' => $this->warehousesWithRacksForSelect(),
        ], 'inertia');
    }

    /**
     * Show the form for adjusting stock quantity.
     */
    public function showAdjustForm(StockRecord $record)
    {
        $this->loadStockRecordForInertia($record);

        return $this->render('admin/resources/stock_record/adjust', [
            'stockRecord' => $record,
        ], 'inertia');
    }

    /**
     * Move stock record to a different rack.
     */
    public function move(MoveStockRecordRequest $request, StockRecord $record)
    {
        $quantityToMove = $request->quantity;
        $reason = $request->reason ?? 'Stock transfer between racks';

        // Create transfer_out movement from source rack
        StockMovement::create([
            'product_id' => $record->product_id,
            'rack_id' => $record->rack_id,
            'type' => 'transfer_out',
            'quantity' => -$quantityToMove,
            'reason' => $reason,
            'created_by' => auth('admin')->id(),
        ]);

        // Recalculate source stock record
        $record->recalculateQuantity();

        // Get or create target stock record
        $targetRecord = StockRecord::getOrCreateForRack($record->product_id, $request->rack_id);

        // Create transfer_in movement to target rack
        StockMovement::create([
            'product_id' => $record->product_id,
            'rack_id' => $request->rack_id,
            'type' => 'transfer_in',
            'quantity' => $quantityToMove,
            'reason' => $reason,
            'created_by' => auth('admin')->id(),
        ]);

        // Recalculate target stock record
        $targetRecord->recalculateQuantity();

        return redirect()->route('admin.stock.records.index')
            ->with('success', 'Stock moved successfully.');
    }

    /**
     * Adjust the quantity of a stock record.
     */
    public function adjustQuantity(AdjustQuantityRequest $request, StockRecord $record)
    {
        StockMovement::create([
            'product_id' => $record->product_id,
            'rack_id' => $record->rack_id,
            'type' => 'adjustment',
            'quantity' => $request->adjustment,
            'reason' => $request->reason ?? 'Manual adjustment',
            'created_by' => auth('admin')->id(),
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
        ], 'inertia');
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
