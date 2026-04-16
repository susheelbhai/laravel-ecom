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

class StockRecordController extends Controller
{
    /**
     * Display a listing of stock records.
     */
    public function index()
    {
        $query = StockRecord::with(['product', 'rack.warehouse']);

        // Filter by warehouse
        if (request('warehouse_id')) {
            $query->whereHas('rack', function ($q) {
                $q->where('warehouse_id', request('warehouse_id'));
            });
        }

        // Filter by product
        if (request('product_id')) {
            $query->where('product_id', request('product_id'));
        }

        // Filter by stock status
        if (request('stock_status')) {
            $query->byStockStatus(request('stock_status'));
        }

        // Search by product name or SKU
        if (request('search')) {
            $query->whereHas('product', function ($q) {
                $q->where('title', 'like', '%'.request('search').'%')
                    ->orWhere('sku', 'like', '%'.request('search').'%');
            });
        }

        $stockRecords = $query->paginate(15);

        // Load filter options
        $warehouses = Warehouse::orderBy('name')->get();
        $products = Product::orderBy('title')->get();

        return $this->render('admin/resources/stock_record/index', [
            'stockRecords' => $stockRecords,
            'warehouses' => $warehouses,
            'products' => $products,
            'filters' => [
                'warehouse_id' => request('warehouse_id'),
                'product_id' => request('product_id'),
                'stock_status' => request('stock_status'),
                'search' => request('search'),
            ],
        ], 'inertia');
    }

    /**
     * Show the form for creating a new stock record.
     */
    public function create()
    {
        $warehouses = Warehouse::with('racks')->orderBy('name')->get();
        $products = Product::orderBy('title')->get();

        return $this->render('admin/resources/stock_record/create', [
            'warehouses' => $warehouses,
            'products' => $products,
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
        $record->load(['product', 'rack.warehouse']);

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
        $record->load(['product', 'rack.warehouse']);
        $warehouses = Warehouse::with('racks')->orderBy('name')->get();

        return $this->render('admin/resources/stock_record/move', [
            'stockRecord' => $record,
            'warehouses' => $warehouses,
        ], 'inertia');
    }

    /**
     * Show the form for adjusting stock quantity.
     */
    public function showAdjustForm(StockRecord $record)
    {
        $record->load(['product', 'rack.warehouse']);

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
        $record->load(['product', 'rack.warehouse']);

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
}
