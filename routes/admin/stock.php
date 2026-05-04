<?php

use App\Http\Controllers\Admin\StockDashboardController;
use App\Http\Controllers\Admin\StockMovementController;
use App\Http\Controllers\Admin\StockRecordController;
use App\Http\Controllers\Admin\OwnedStockController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\WarehouseRackController;
use Illuminate\Support\Facades\Route;

Route::prefix('stock')->name('stock.')->group(function () {
    Route::get('products/search', [StockRecordController::class, 'searchProducts'])
        ->name('products.search');

    // Dashboard routes
    Route::get('dashboard', [StockDashboardController::class, 'index'])->name('dashboard.index');
    Route::get('dashboard/warehouse/{warehouse}', [StockDashboardController::class, 'byWarehouse'])->name('dashboard.warehouse');
    Route::get('dashboard/product/{product}', [StockDashboardController::class, 'byProduct'])->name('dashboard.product');

    // Warehouse resource routes
    Route::resource('warehouses', WarehouseController::class)->except(['show']);

    // Rack resource routes (nested under warehouse for create)
    Route::get('warehouses/{warehouse}/racks', [WarehouseRackController::class, 'index'])->name('warehouses.racks.index');
    Route::get('warehouses/{warehouse}/racks/create', [WarehouseRackController::class, 'create'])->name('warehouses.racks.create');
    Route::post('warehouses/{warehouse}/racks', [WarehouseRackController::class, 'store'])->name('warehouses.racks.store');

    // Rack resource routes (non-nested for edit/update/delete)
    Route::get('racks/{rack}/edit', [WarehouseRackController::class, 'edit'])->name('racks.edit');
    Route::put('racks/{rack}', [WarehouseRackController::class, 'update'])->name('racks.update');
    Route::delete('racks/{rack}', [WarehouseRackController::class, 'destroy'])->name('racks.destroy');

    // Stock record resource routes
    Route::resource('records', StockRecordController::class)->except(['show']);

    // Stock record move and adjust routes
    Route::get('records/{record}/move', [StockRecordController::class, 'showMoveForm'])->name('records.move.form');
    Route::post('records/{record}/move', [StockRecordController::class, 'move'])->name('records.move');
    Route::get('records/{record}/adjust', [StockRecordController::class, 'showAdjustForm'])->name('records.adjust.form');
    Route::post('records/{record}/adjust', [StockRecordController::class, 'adjustQuantity'])->name('records.adjust');
    Route::get('records/{record}/history', [StockRecordController::class, 'history'])->name('records.history');

    // Stock movement routes
    Route::get('movements', [StockMovementController::class, 'index'])->name('movements.index');
    Route::post('movements', [StockMovementController::class, 'store'])->name('movements.store');
    Route::get('movements/product/{product}', [StockMovementController::class, 'byProduct'])->name('movements.by-product');
    Route::get('movements/warehouse/{warehouse}', [StockMovementController::class, 'byWarehouse'])->name('movements.by-warehouse');

    // Owned stock (Distributor / Dealer)
    Route::get('distributors', [OwnedStockController::class, 'distributorsIndex'])->name('distributors.index');
    Route::get('distributors/{distributor}', [OwnedStockController::class, 'distributorsShow'])->name('distributors.show');
    Route::get('dealers', [OwnedStockController::class, 'dealersIndex'])->name('dealers.index');
    Route::get('dealers/{dealer}', [OwnedStockController::class, 'dealersShow'])->name('dealers.show');
});
