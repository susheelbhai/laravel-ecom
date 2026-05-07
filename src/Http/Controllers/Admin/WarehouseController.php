<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use App\Models\Warehouse;

class WarehouseController extends Controller
{
    public function index()
    {
        $warehouses = Warehouse::where('owner_type', 'admin')
            ->withCount('racks')
            ->paginate(15);

        return $this->render('admin/resources/warehouse/index', [
            'warehouses' => $warehouses,
        ]);
    }

    public function create()
    {
        return $this->render('admin/resources/warehouse/create', [
            'warehouse' => null,
        ]);
    }

    public function store(StoreWarehouseRequest $request)
    {
        Warehouse::create(array_merge($request->validated(), [
            'owner_type' => 'admin',
            'owner_id' => null,
        ]));

        return redirect()->route('admin.stock.warehouses.index')
            ->with('success', 'Warehouse created successfully.');
    }

    public function edit(Warehouse $warehouse)
    {
        // Ensure the warehouse belongs to admin
        if ($warehouse->owner_type !== 'admin') {
            abort(403, 'Unauthorized access to this warehouse.');
        }

        return $this->render('admin/resources/warehouse/edit', [
            'warehouse' => $warehouse,
        ]);
    }

    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse)
    {
        // Ensure the warehouse belongs to admin
        if ($warehouse->owner_type !== 'admin') {
            abort(403, 'Unauthorized access to this warehouse.');
        }

        $warehouse->update($request->validated());

        return redirect()->route('admin.stock.warehouses.index')
            ->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Warehouse $warehouse)
    {
        // Ensure the warehouse belongs to admin
        if ($warehouse->owner_type !== 'admin') {
            abort(403, 'Unauthorized access to this warehouse.');
        }

        if ($warehouse->racks()->count() > 0) {
            return back()->with('error', 'Cannot delete warehouse that contains racks. Please delete all racks first.');
        }

        $warehouse->delete();

        return redirect()->route('admin.stock.warehouses.index')
            ->with('success', 'Warehouse deleted successfully.');
    }
}
