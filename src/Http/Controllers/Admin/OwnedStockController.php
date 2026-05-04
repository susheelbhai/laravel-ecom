<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dealer;
use App\Models\Distributor;
use App\Models\StockRecord;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class OwnedStockController extends Controller
{
    public function distributorsIndex()
    {
        $totals = DB::table('warehouses')
            ->join('warehouse_racks', 'warehouse_racks.warehouse_id', '=', 'warehouses.id')
            ->join('stock_records', 'stock_records.rack_id', '=', 'warehouse_racks.id')
            ->where('warehouses.owner_type', 'distributor')
            ->groupBy('warehouses.owner_id')
            ->select('warehouses.owner_id', DB::raw('SUM(stock_records.quantity) as total_quantity'))
            ->pluck('total_quantity', 'owner_id');

        $data = Distributor::query()
            ->latest('id')
            ->paginate(15)
            ->through(fn (Distributor $d) => [
                'id' => $d->id,
                'name' => $d->name,
                'email' => $d->email,
                'application_status' => $d->application_status,
                'total_quantity' => (int) ($totals[$d->id] ?? 0),
                'created_at' => $d->created_at?->format('M d, Y'),
            ]);

        return $this->render('admin/stock/distributors/index', compact('data'));
    }

    public function distributorsShow(Distributor $distributor)
    {
        $warehouseIds = Warehouse::query()
            ->where('owner_type', 'distributor')
            ->where('owner_id', $distributor->id)
            ->pluck('id');

        $data = StockRecord::query()
            ->with(['product:id,title,sku', 'rack:id,warehouse_id,identifier', 'rack.warehouse:id,name'])
            ->whereHas('rack.warehouse', fn ($q) => $q->whereIn('id', $warehouseIds))
            ->latest('id')
            ->paginate(50)
            ->through(fn (StockRecord $record) => [
                'id' => $record->id,
                'product_title' => $record->product?->title,
                'sku' => $record->product?->sku,
                'quantity' => $record->quantity,
                'warehouse' => $record->rack?->warehouse?->name,
                'rack' => $record->rack?->identifier,
            ]);

        $owner = [
            'id' => $distributor->id,
            'name' => $distributor->name,
            'email' => $distributor->email,
        ];

        return $this->render('admin/stock/distributors/show', compact('owner', 'data'));
    }

    public function dealersIndex()
    {
        $totals = DB::table('warehouses')
            ->join('warehouse_racks', 'warehouse_racks.warehouse_id', '=', 'warehouses.id')
            ->join('stock_records', 'stock_records.rack_id', '=', 'warehouse_racks.id')
            ->where('warehouses.owner_type', 'dealer')
            ->groupBy('warehouses.owner_id')
            ->select('warehouses.owner_id', DB::raw('SUM(stock_records.quantity) as total_quantity'))
            ->pluck('total_quantity', 'owner_id');

        $data = Dealer::query()
            ->with('distributor:id,name,email')
            ->latest('id')
            ->paginate(15)
            ->through(fn (Dealer $d) => [
                'id' => $d->id,
                'name' => $d->name,
                'email' => $d->email,
                'distributor_name' => $d->distributor?->name,
                'application_status' => $d->application_status,
                'total_quantity' => (int) ($totals[$d->id] ?? 0),
                'created_at' => $d->created_at?->format('M d, Y'),
            ]);

        return $this->render('admin/stock/dealers/index', compact('data'));
    }

    public function dealersShow(Dealer $dealer)
    {
        $warehouseIds = Warehouse::query()
            ->where('owner_type', 'dealer')
            ->where('owner_id', $dealer->id)
            ->pluck('id');

        $data = StockRecord::query()
            ->with(['product:id,title,sku', 'rack:id,warehouse_id,identifier', 'rack.warehouse:id,name'])
            ->whereHas('rack.warehouse', fn ($q) => $q->whereIn('id', $warehouseIds))
            ->latest('id')
            ->paginate(50)
            ->through(fn (StockRecord $record) => [
                'id' => $record->id,
                'product_title' => $record->product?->title,
                'sku' => $record->product?->sku,
                'quantity' => $record->quantity,
                'warehouse' => $record->rack?->warehouse?->name,
                'rack' => $record->rack?->identifier,
            ]);

        $owner = [
            'id' => $dealer->id,
            'name' => $dealer->name,
            'email' => $dealer->email,
        ];

        return $this->render('admin/stock/dealers/show', compact('owner', 'data'));
    }
}

