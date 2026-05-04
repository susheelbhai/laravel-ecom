<?php

use App\Http\Controllers\Distributor\DealerController;
use App\Http\Controllers\Distributor\DealerOrderController;
use App\Http\Controllers\Distributor\DistributorOrderController;
use App\Http\Controllers\Distributor\HomeController;
use App\Http\Controllers\Distributor\NotificationController;
use App\Http\Controllers\Distributor\OrderProductController;
use App\Http\Controllers\Distributor\StockController;
use App\Http\Middleware\EnsureDistributorApproved;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', HandleInertiaRequests::class])->group(function () {
    Route::prefix('distributor')->name('distributor.')->middleware(['auth:distributor', EnsureDistributorApproved::class])->group(function () {
        Route::get('/', [HomeController::class, 'dashboard'])->name('dashboard');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notification.index');
        Route::get('/notification/{id}', [NotificationController::class, 'show'])->name('notification.show');
        Route::resource('dealer', DealerController::class)->only(['index', 'create', 'store']);

        Route::get('/products', [OrderProductController::class, 'index'])->name('products.index');
        Route::get('/products/search', [OrderProductController::class, 'search'])->name('products.search');

        Route::get('/purchase-orders', [DistributorOrderController::class, 'index'])->name('purchase-orders.index');
        Route::get('/purchase-orders/create', [DistributorOrderController::class, 'create'])->name('purchase-orders.create');
        Route::post('/purchase-orders', [DistributorOrderController::class, 'store'])->name('purchase-orders.store');
        Route::post('/purchase-orders/{purchase_order}/items', [DistributorOrderController::class, 'addItem'])->name('purchase-orders.items.add');
        Route::get('/purchase-orders/{purchase_order}', [DistributorOrderController::class, 'show'])->name('purchase-orders.show');

        Route::get('/dealer-orders', [DealerOrderController::class, 'index'])->name('dealer-orders.index');
        Route::get('/dealer-orders/create', [DealerOrderController::class, 'create'])->name('dealer-orders.create');
        Route::post('/dealer-orders', [DealerOrderController::class, 'store'])->name('dealer-orders.store');
        Route::get('/dealer-orders/{dealer_order}', [DealerOrderController::class, 'show'])->name('dealer-orders.show');

        Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
        Route::get('/dealers/{dealer}/stock', [StockController::class, 'dealerStock'])->name('dealers.stock.show');
    });
    require __DIR__.'/auth.php';
    require __DIR__.'/settings.php';
});
