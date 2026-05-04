<?php

use App\Http\Controllers\Dealer\HomeController;
use App\Http\Controllers\Dealer\NotificationController;
use App\Http\Controllers\Dealer\OrderController;
use App\Http\Controllers\Dealer\RetailSaleController;
use App\Http\Controllers\Dealer\StockController;
use App\Http\Middleware\EnsureDealerApproved;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', HandleInertiaRequests::class])->group(function () {
    Route::prefix('dealer')->name('dealer.')->middleware(['auth:dealer', EnsureDealerApproved::class])->group(function () {
        Route::get('/', [HomeController::class, 'dashboard'])->name('dashboard');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notification.index');
        Route::get('/notification/{id}', [NotificationController::class, 'show'])->name('notification.show');

        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

        Route::get('/stock', [StockController::class, 'index'])->name('stock.index');

        Route::get('/retail-sales', [RetailSaleController::class, 'index'])->name('retail-sales.index');
        Route::get('/retail-sales/create', [RetailSaleController::class, 'create'])->name('retail-sales.create');
        Route::post('/retail-sales', [RetailSaleController::class, 'store'])->name('retail-sales.store');
        Route::get('/retail-sales/{retail_sale}', [RetailSaleController::class, 'show'])->name('retail-sales.show');
    });
    require __DIR__.'/auth.php';
    require __DIR__.'/settings.php';
});
