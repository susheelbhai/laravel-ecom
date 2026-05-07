<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockRecord;
use App\Models\Warehouse;

class StockDashboardController extends Controller
{
    /**
     * Display the stock dashboard.
     */
    public function index()
    {
        $totalWarehouses = Warehouse::where('owner_type', 'admin')->count();
        $totalRacks = Warehouse::where('owner_type', 'admin')->withCount('racks')->get()->sum('racks_count');
        $totalProductsInStock = StockRecord::where('quantity', '>', 0)->distinct('product_id')->count('product_id');
        $lowStockAlerts = StockRecord::where('quantity', '>', 0)
            ->where('quantity', '<=', 10)
            ->with(['product', 'rack.warehouse'])
            ->whereHas('rack.warehouse', function ($query) {
                $query->where('owner_type', 'admin');
            })
            ->get();

        return $this->render('admin/resources/stock_record/dashboard', [
            'totalWarehouses' => $totalWarehouses,
            'totalRacks' => $totalRacks,
            'totalProductsInStock' => $totalProductsInStock,
            'lowStockAlerts' => $lowStockAlerts,
        ]);
    }

    /**
     * Display stock levels by warehouse.
     */
    public function byWarehouse(Warehouse $warehouse)
    {
        // Ensure the warehouse belongs to admin
        if ($warehouse->owner_type !== 'admin') {
            abort(403, 'Unauthorized access to this warehouse.');
        }

        $stockRecords = StockRecord::whereHas('rack', function ($query) use ($warehouse) {
            $query->where('warehouse_id', $warehouse->id);
        })
            ->with(['product', 'rack'])
            ->get()
            ->groupBy('product_id')
            ->map(function ($records) {
                return [
                    'product' => $records->first()->product,
                    'total_quantity' => $records->sum('quantity'),
                    'locations' => $records->map(function ($record) {
                        return [
                            'rack' => $record->rack->identifier,
                            'quantity' => $record->quantity,
                        ];
                    }),
                ];
            });

        return $this->render('admin/resources/stock_record/warehouse_view', [
            'warehouse' => $warehouse,
            'stockRecords' => $stockRecords->values(),
        ]);
    }

    /**
     * Display stock levels by product.
     */
    public function byProduct(Product $product)
    {
        $stockRecords = StockRecord::where('product_id', $product->id)
            ->with(['rack.warehouse'])
            ->get();

        $totalQuantity = $stockRecords->sum('quantity');

        return $this->render('admin/resources/stock_record/product_view', [
            'product' => $product,
            'stockRecords' => $stockRecords,
            'totalQuantity' => $totalQuantity,
        ]);
    }
}
