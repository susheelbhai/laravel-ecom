<?php

use App\Http\Controllers\User\AddressController;
use App\Http\Controllers\User\BlogController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\CheckoutController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\User\ProductController;
use App\Http\Controllers\User\ProductPageBannerController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\PromoCodeController;
use App\Http\Controllers\User\ReviewController;
use App\Http\Controllers\User\ReviewVoteController;
use App\Http\Controllers\User\WishlistController;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\TrackVisitor;
use App\Models\Visitor;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', HandleInertiaRequests::class, TrackVisitor::class])->group(function () {
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::get('/dashboard', [HomeController::class, 'dashboard'])->name('dashboard');

        // Address routes
        Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
        Route::get('/addresses/create', [AddressController::class, 'create'])->name('addresses.create');
        Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
        Route::get('/addresses/{address}/edit', [AddressController::class, 'edit'])->name('addresses.edit');
        Route::patch('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
        Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
        Route::post('/addresses/{address}/set-default', [AddressController::class, 'setDefault'])->name('addresses.setDefault');

        // Checkout routes
        Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
        Route::get('/order/{order}/payment', [CheckoutController::class, 'initiatePayment'])->name('payment.initiate');
        Route::get('/order/{order}/success', [CheckoutController::class, 'success'])->name('order.success');

        // Order routes
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

        // Promo code validation route
        Route::post('/api/promo-code/validate', [PromoCodeController::class, 'validate'])->name('promo-code.validate');

        // Review routes
        Route::get('/reviews/{review}/edit', [ReviewController::class, 'edit'])->name('reviews.edit');
        Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
        Route::patch('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
        Route::post('/reviews/{review}/vote', [ReviewVoteController::class, 'vote'])->name('reviews.vote');
        Route::delete('/reviews/{review}/vote', [ReviewVoteController::class, 'removeVote'])->name('reviews.removeVote');
    });
    // your routes here
    Route::get('/', [HomeController::class, 'home'])->name('home');
    Route::get('/about', [HomeController::class, 'about'])->name('about');
    // Route::get('/blogs', [BlogController::class, 'index'])->name('blog.index');
    // Route::get('/blog/{id}', [BlogController::class, 'show'])->name('blog.show');
    // Route::post('/blog/comment/{id}', [BlogController::class, 'postComment'])->name('blog.comment');
    Route::get('/productCategory/{id}', [ProductController::class, 'productCategory'])->name('productCategory.show');
    Route::get('/product', [ProductController::class, 'index'])->name('product.index');
    Route::get('/product/{id}', [ProductController::class, 'productDetail'])->name('product.show');
    Route::get('/products/{product}/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::post('/product_enquiry', [ProductController::class, 'productEnquiry'])->name('product.enquiry');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/item/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/item/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
    Route::middleware('auth')->group(function () {
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::get('/wishlist/check', [WishlistController::class, 'check'])->name('wishlist.check');
        Route::post('/wishlist/add', [WishlistController::class, 'add'])->name('wishlist.add');
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
        Route::delete('/wishlist/item/{productId}', [WishlistController::class, 'remove'])->name('wishlist.remove');
    });
    Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
    Route::post('/contact', [HomeController::class, 'contactSubmit']);
    Route::post('/newsletter', [HomeController::class, 'newsletter'])->name('newsletter');
    Route::get('/privacy', [HomeController::class, 'privacy'])->name('privacy');
    Route::get('/tnc', [HomeController::class, 'tnc'])->name('tnc');
    Route::get('/refund', [HomeController::class, 'refund'])->name('refund');
    Route::get('/faq', [HomeController::class, 'faq'])->name('faq');
    require __DIR__.'/auth.php';
    require __DIR__.'/../settings.php';
});

Route::get('/api/visitors/count', function () {
    return response()->json([
        'total' => Visitor::count(),
        'today' => Visitor::whereDate('created_at', now())->count(),
    ]);
});

Route::get('/api/product-page-banners', [ProductPageBannerController::class, 'getActiveBanners']);
