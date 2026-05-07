<?php

use App\Http\Controllers\Technician\HomeController;
use App\Http\Controllers\Technician\NotificationController;
use App\Http\Controllers\Technician\ScanController;
use App\Http\Middleware\EnsureTechnicianApproved;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', HandleInertiaRequests::class])->group(function () {
    Route::prefix('technician')->name('technician.')->middleware(['auth:technician', EnsureTechnicianApproved::class])->group(function () {
        Route::get('/', [HomeController::class, 'dashboard'])->name('dashboard');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notification.index');
        Route::get('/notification/{id}', [NotificationController::class, 'show'])->name('notification.show');

        Route::post('/scan', [ScanController::class, 'scan'])->name('scan');
    });
    require __DIR__.'/auth.php';
    require __DIR__.'/settings.php';
});
