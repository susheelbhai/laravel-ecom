<?php

use App\Http\Controllers\SitemapController;
use App\Http\Controllers\User\EmailImageController;
use App\Http\Middleware\ShareDataMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/link-storage', function () {
    $target = storage_path('app/public');
    $link = public_path('storage');

    // Check if link already exists
    if (file_exists($link)) {
        return "The link already exists: $link";
    }

    // Create the symlink
    symlink($target, $link);

    return "Symlink created successfully: $target -> $link";
});

// Path must not end in ".svg": many nginx configs serve static extensions and return 404 before Laravel.
Route::get('/contact/email-image', EmailImageController::class)->name('public.email.svg');
Route::get('/contact/email.svg', EmailImageController::class);

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('dashboard');
});

Route::middleware([ShareDataMiddleware::class])->group(function () {
    require __DIR__.'/user/web.php';
    require __DIR__.'/seller/web.php';
    require __DIR__.'/admin/web.php';
    require __DIR__.'/partner/web.php';
    require __DIR__.'/distributor/web.php';
    require __DIR__.'/dealer/web.php';
});
