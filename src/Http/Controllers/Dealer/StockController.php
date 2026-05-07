<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SerialNumber;
use App\Models\Warehouse;
use App\Models\WarehouseRack;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    /**
     * @param  LengthAwarePaginator  $paginator  paginated rows having `id` as product_id
     */
    private function attachProductThumbnails(LengthAwarePaginator $paginator): void
    {
        $rows = collect($paginator->items());
        $productIds = $rows->pluck('id')->filter()->values();

        if ($productIds->isEmpty()) {
            return;
        }

        $products = Product::query()
            ->whereIn('id', $productIds)
            ->get(['id'])
            ->keyBy('id');

        $paginator->setCollection(
            $rows->map(function ($row) use ($products) {
                $product = $products->get($row->id);
                $row->thumbnail = $product?->thumbnail ?? $product?->display_img ?? null;

                return $row;
            })
        );
    }

    public function index()
    {
        $dealerId = Auth::guard('dealer')->id();

        $warehouseIds = Warehouse::query()
            ->where('owner_type', 'dealer')
            ->where('owner_id', $dealerId)
            ->pluck('id');

        $data = DB::table('stock_records')
            ->join('warehouse_racks', 'warehouse_racks.id', '=', 'stock_records.rack_id')
            ->join('warehouses', 'warehouses.id', '=', 'warehouse_racks.warehouse_id')
            ->join('products', 'products.id', '=', 'stock_records.product_id')
            ->whereIn('warehouses.id', $warehouseIds)
            ->groupBy('stock_records.product_id', 'products.title', 'products.sku')
            ->select([
                'stock_records.product_id as id',
                'products.title as product_title',
                'products.sku as sku',
                DB::raw('SUM(stock_records.quantity) as quantity'),
            ])
            ->orderBy('products.title')
            ->paginate(50);

        $this->attachProductThumbnails($data);

        // Attach available serial numbers per product from dealer's racks
        $rackIds = WarehouseRack::whereIn('warehouse_id', $warehouseIds)->pluck('id');
        $serialsByProduct = SerialNumber::whereIn('rack_id', $rackIds)
            ->where('status', 'available')
            ->orderBy('serial_number')
            ->get(['product_id', 'serial_number'])
            ->groupBy('product_id')
            ->map(fn ($group) => $group->pluck('serial_number')->all());

        $data->setCollection(
            collect($data->items())->map(function ($row) use ($serialsByProduct) {
                $row->serial_numbers = $serialsByProduct->get($row->id, []);

                return $row;
            })
        );

        return $this->render('dealer/stock/index', compact('data'));
    }
}
