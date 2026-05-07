<?php

use App\Http\Controllers\Distributor\DamagedStolenSerialController;
use App\Http\Controllers\Distributor\DealerController;
use App\Http\Controllers\Distributor\DealerOrderController;
use App\Http\Controllers\Distributor\DealerOrderPaymentController;
use App\Http\Controllers\Distributor\DistributorOrderController;
use App\Http\Controllers\Distributor\HomeController;
use App\Http\Controllers\Distributor\NotificationController;
use App\Http\Controllers\Distributor\OrderProductController;
use App\Http\Controllers\Distributor\SerialNumberController;
use App\Http\Controllers\Distributor\StockController;
use App\Http\Middleware\EnsureDistributorApproved;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', HandleInertiaRequests::class])->group(function () {
    Route::prefix('distributor')->name('distributor.')->middleware(['auth:distributor', EnsureDistributorApproved::class])->group(function () {
        Route::get('/', [HomeController::class, 'dashboard'])->name('dashboard');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notification.index');
        Route::get('/notification/{id}', [NotificationController::class, 'show'])->name('notification.show');
        Route::resource('dealer', DealerController::class)->only(['index', 'create', 'store', 'show']);

        Route::get('/products', [OrderProductController::class, 'index'])->name('products.index');
        Route::get('/products/search', [OrderProductController::class, 'search'])->name('products.search');
        Route::get('/products/{product}/price', [OrderProductController::class, 'price'])->name('products.price');

        Route::get('/purchase-orders', [DistributorOrderController::class, 'index'])->name('purchase-orders.index');
        Route::get('/purchase-orders/create', [DistributorOrderController::class, 'create'])->name('purchase-orders.create');
        Route::post('/purchase-orders', [DistributorOrderController::class, 'store'])->name('purchase-orders.store');
        Route::post('/purchase-orders/{purchase_order}/items', [DistributorOrderController::class, 'addItem'])->name('purchase-orders.items.add');
        Route::get('/purchase-orders/{purchase_order}', [DistributorOrderController::class, 'show'])->name('purchase-orders.show');

        Route::get('/dealer-orders', [DealerOrderController::class, 'index'])->name('dealer-orders.index');
        Route::get('/dealer-orders/create', [DealerOrderController::class, 'create'])->name('dealer-orders.create');
        Route::post('/dealer-orders', [DealerOrderController::class, 'store'])->name('dealer-orders.store');
        Route::get('/dealer-orders/{dealer_order}', [DealerOrderController::class, 'show'])->name('dealer-orders.show');
        Route::post('/dealer-orders/{dealer_order}/payments', [DealerOrderPaymentController::class, 'store'])->name('dealer-orders.payments.store');
        Route::get('/products/{product}/serials', [DealerOrderController::class, 'productSerials'])->name('products.serials');

        Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
        Route::get('/dealers/{dealer}/stock', [StockController::class, 'dealerStock'])->name('dealers.stock.show');

        Route::get('/serial-numbers/lookup', [SerialNumberController::class, 'lookup'])->name('serial-numbers.lookup');
        Route::post('/serial-numbers/{serialNumber}/mark-stolen', [SerialNumberController::class, 'markStolen'])->name('serial-numbers.mark-stolen');
        Route::post('/serial-numbers/{serialNumber}/mark-damaged', [SerialNumberController::class, 'markDamaged'])->name('serial-numbers.mark-damaged');
        Route::get('/serial-numbers/damaged', [DamagedStolenSerialController::class, 'damaged'])->name('serial-numbers.damaged');
        Route::get('/serial-numbers/stolen', [DamagedStolenSerialController::class, 'stolen'])->name('serial-numbers.stolen');
    });
    require __DIR__.'/auth.php';
    require __DIR__.'/settings.php';
});
