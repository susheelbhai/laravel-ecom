<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecordStockMovementRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\StockRecord;
use App\Models\Warehouse;

class StockMovementController extends Controller
{
    /**
     * Display a listing of stock movements.
     */
    public function index()
    {
        $query = StockMovement::with(['product', 'rack.warehouse', 'createdBy']);

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

        // Filter by movement type
        if (request('type')) {
            $query->where('type', request('type'));
        }

        // Filter by date range
        if (request('date_from')) {
            $query->whereDate('created_at', '>=', request('date_from'));
        }

        if (request('date_to')) {
            $query->whereDate('created_at', '<=', request('date_to'));
        }

        // Search by product name or SKU
        if (request('search')) {
            $query->whereHas('product', function ($q) {
                $q->where('title', 'like', '%'.request('search').'%')
                    ->orWhere('sku', 'like', '%'.request('search').'%');
            });
        }

        $movements = $query->orderBy('created_at', 'desc')->paginate(20);

        // Load filter options
        $warehouses = Warehouse::orderBy('name')->get();
        $products = Product::orderBy('title')->get();

        return $this->render('admin/resources/stock_movement/index', [
            'movements' => $movements,
            'warehouses' => $warehouses,
            'products' => $products,
            'filters' => [
                'warehouse_id' => request('warehouse_id'),
                'product_id' => request('product_id'),
                'type' => request('type'),
                'date_from' => request('date_from'),
                'date_to' => request('date_to'),
                'search' => request('search'),
            ],
        ], 'inertia');
    }

    /**
     * Store a new stock movement.
     */
    public function store(RecordStockMovementRequest $request)
    {
        $movement = StockMovement::create([
            'product_id' => $request->product_id,
            'rack_id' => $request->rack_id,
            'type' => $request->type,
            'quantity' => $request->quantity,
            'reason' => $request->reason,
            'created_by' => auth('admin')->id(),
        ]);

        // Update or create stock record
        $stockRecord = StockRecord::getOrCreateForRack($request->product_id, $request->rack_id);
        $stockRecord->recalculateQuantity();

        $message = match ($request->type) {
            'in' => 'Stock added successfully.',
            'out' => 'Stock removed successfully.',
            'adjustment' => 'Stock adjusted successfully.',
            default => 'Stock movement recorded successfully.',
        };

        return back()->with('success', $message);
    }

    /**
     * Display stock movements for a specific product.
     */
    public function byProduct(Product $product)
    {
        $movements = StockMovement::where('product_id', $product->id)
            ->with(['rack.warehouse', 'createdBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return $this->render('admin/resources/stock_movement/by_product', [
            'product' => $product,
            'movements' => $movements,
        ], 'inertia');
    }

    /**
     * Display stock movements for a specific warehouse.
     */
    public function byWarehouse(Warehouse $warehouse)
    {
        $movements = StockMovement::whereHas('rack', function ($q) use ($warehouse) {
            $q->where('warehouse_id', $warehouse->id);
        })
            ->with(['product', 'rack', 'createdBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return $this->render('admin/resources/stock_movement/by_warehouse', [
            'warehouse' => $warehouse,
            'movements' => $movements,
        ], 'inertia');
    }
}
