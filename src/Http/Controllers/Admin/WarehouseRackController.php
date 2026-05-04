<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRackRequest;
use App\Http\Requests\UpdateRackRequest;
use App\Models\Warehouse;
use App\Models\WarehouseRack;

class WarehouseRackController extends Controller
{
    /**
     * Display a listing of racks for a specific warehouse.
     */
    public function index(Warehouse $warehouse)
    {
        // Ensure the warehouse belongs to admin
        if ($warehouse->owner_type !== 'admin') {
            abort(403, 'Unauthorized access to this warehouse.');
        }

        $racks = $warehouse->racks()->withCount('stockRecords')->paginate(15);

        return $this->render('admin/resources/warehouse_rack/index', [
            'racks' => $racks,
            'warehouse' => $warehouse,
        ], 'inertia');
    }

    /**
     * Show the form for creating a new rack.
     */
    public function create(Warehouse $warehouse)
    {
        // Ensure the warehouse belongs to admin
        if ($warehouse->owner_type !== 'admin') {
            abort(403, 'Unauthorized access to this warehouse.');
        }

        return $this->render('admin/resources/warehouse_rack/create', [
            'warehouse' => $warehouse,
        ], 'inertia');
    }

    /**
     * Store a newly created rack in storage.
     */
    public function store(StoreRackRequest $request, Warehouse $warehouse)
    {
        // Ensure the warehouse belongs to admin
        if ($warehouse->owner_type !== 'admin') {
            abort(403, 'Unauthorized access to this warehouse.');
        }

        $warehouse->racks()->create($request->validated());

        return redirect()->route('admin.stock.warehouses.racks.index', $warehouse)
            ->with('success', 'Rack created successfully.');
    }

    /**
     * Show the form for editing the specified rack.
     */
    public function edit(WarehouseRack $rack)
    {
        $rack->load('warehouse');

        return $this->render('admin/resources/warehouse_rack/edit', [
            'rack' => $rack,
        ], 'inertia');
    }

    /**
     * Update the specified rack in storage.
     */
    public function update(UpdateRackRequest $request, WarehouseRack $rack)
    {
        $rack->update($request->validated());

        return redirect()->route('admin.stock.warehouses.racks.index', $rack->warehouse_id)
            ->with('success', 'Rack updated successfully.');
    }

    /**
     * Remove the specified rack from storage.
     */
    public function destroy(WarehouseRack $rack)
    {
        if ($rack->stockRecords()->count() > 0) {
            return back()->with('error', 'Cannot delete rack that contains stock records. Please delete all stock records first.');
        }

        $warehouseId = $rack->warehouse_id;
        $rack->delete();

        return redirect()->route('admin.stock.warehouses.racks.index', $warehouseId)
            ->with('success', 'Rack deleted successfully.');
    }
}
