<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;

class WarehouseController extends Controller
{
    public function index()
    {
        $warehouses = Warehouse::withCount('racks')->paginate(15);

        return $this->render('admin/resources/warehouse/index', [
            'warehouses' => $warehouses,
        ], 'inertia');
    }

    public function create()
    {
        return $this->render('admin/resources/warehouse/create', [
            'warehouse' => null,
        ], 'inertia');
    }

    public function store(\App\Http\Requests\StoreWarehouseRequest $request)
    {
        Warehouse::create($request->validated());

        return redirect()->route('admin.stock.warehouses.index')
            ->with('success', 'Warehouse created successfully.');
    }

    public function edit(Warehouse $warehouse)
    {
        return $this->render('admin/resources/warehouse/edit', [
            'warehouse' => $warehouse,
        ], 'inertia');
    }

    public function update(\App\Http\Requests\UpdateWarehouseRequest $request, Warehouse $warehouse)
    {
        $warehouse->update($request->validated());

        return redirect()->route('admin.stock.warehouses.index')
            ->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Warehouse $warehouse)
    {
        if ($warehouse->racks()->count() > 0) {
            return back()->with('error', 'Cannot delete warehouse that contains racks. Please delete all racks first.');
        }

        $warehouse->delete();

        return redirect()->route('admin.stock.warehouses.index')
            ->with('success', 'Warehouse deleted successfully.');
    }
}
