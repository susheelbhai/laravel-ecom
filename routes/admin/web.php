<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DamagedStolenSerialController;
use App\Http\Controllers\Admin\DealerController;
use App\Http\Controllers\Admin\DistributorController;
use App\Http\Controllers\Admin\DistributorOrderController;
use App\Http\Controllers\Admin\DistributorOrderPaymentController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\ImportantLinkController;
use App\Http\Controllers\Admin\NewsletterController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PagesController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\PortfolioController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductEnquiryController;
use App\Http\Controllers\Admin\ProductPageBannerController;
use App\Http\Controllers\Admin\ProductWarrantyController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\PromoCodeController;
use App\Http\Controllers\Admin\RecommendationConfigController;
use App\Http\Controllers\Admin\ReviewModerationController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SellerController;
use App\Http\Controllers\Admin\SerialNumberController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\AdvanceSettingController;
use App\Http\Controllers\Admin\Slider1Controller;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\TechnicianController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserQueryController;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', HandleInertiaRequests::class])->group(function () {
    Route::prefix('admin')->name('admin.')->middleware(['auth:admin'])->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/', [HomeController::class, 'dashboard'])->name('dashboard');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notification.index');
        Route::get('/notification/{id}', [NotificationController::class, 'show'])->name('notification.show');
        Route::name('settings.')->controller(SettingController::class)->prefix('setting')->group(function () {
            Route::get('/general', 'generalSettings')->name('general');
            Route::patch('/general', 'generalSettingsUpdate');
        });
        Route::name('settings.')->controller(AdvanceSettingController::class)->prefix('setting')->group(function () {
            Route::get('/trust-badges', 'trustBadgesSettings')->name('trust-badges');
            Route::patch('/trust-badges', 'trustBadgesUpdate');
        });

        Route::name('pages.')->controller(PagesController::class)->prefix('pages')->group(function () {
            Route::get('/authPage', 'authPage')->name('authPage');
            Route::patch('/authPage', 'updateAuthPage')->name('updateAuthPage');
            Route::get('/homePage', 'homePage')->name('homePage');
            Route::patch('/homePage', 'updateHomePage')->name('updateHomePage');
            Route::get('/aboutPage', 'aboutPage')->name('aboutPage');
            Route::patch('/aboutPage', 'updateAboutPage')->name('updateAboutPage');
            Route::get('/contactPage', 'contactPage')->name('contactPage');
            Route::patch('/contactPage', 'updateContactPage')->name('updateContactPage');
            Route::get('/tncPage', 'tncPage')->name('tncPage');
            Route::patch('/tncPage', 'updateTncPage')->name('updateTncPage');
            Route::get('/privacyPage', 'privacyPage')->name('privacyPage');
            Route::patch('/privacyPage', 'updatePrivacyPage')->name('updatePrivacyPage');
            Route::get('/refundPage', 'refundPage')->name('refundPage');
            Route::patch('/refundPage', 'updateRefundPage')->name('updateRefundPage');
        });
        // Route::middleware('role:Super Admin')->group(function () {
        //     Route::resource('/admin', AdminController::class);
        //     Route::resource('/role', RoleController::class);
        //     Route::resource('/permission', PermissionController::class);
        // });
        // Route::resource('/slider1', Slider1Controller::class)->except(['show', 'destroy']);
        // Route::resource('/slider', SliderController::class);
        // Route::resource('/partner', PartnerController::class);
        Route::get('/distributor', [DistributorController::class, 'index'])->name('distributor.index');
        Route::get('/distributor/{distributor}', [DistributorController::class, 'show'])->name('distributor.show');
        Route::patch('/distributor/{distributor}/approve', [DistributorController::class, 'approve'])->name('distributor.approve');
        Route::patch('/distributor/{distributor}/reject', [DistributorController::class, 'reject'])->name('distributor.reject');
        Route::get('/dealer', [DealerController::class, 'index'])->name('dealer.index');
        Route::get('/dealer/{dealer}', [DealerController::class, 'show'])->name('dealer.show');
        Route::patch('/dealer/{dealer}/approve', [DealerController::class, 'approve'])->name('dealer.approve');
        Route::patch('/dealer/{dealer}/reject', [DealerController::class, 'reject'])->name('dealer.reject');
        Route::get('/technician', [TechnicianController::class, 'index'])->name('technician.index');
        Route::get('/technician/{technician}', [TechnicianController::class, 'show'])->name('technician.show');
        Route::patch('/technician/{technician}/approve', [TechnicianController::class, 'approve'])->name('technician.approve');
        Route::patch('/technician/{technician}/reject', [TechnicianController::class, 'reject'])->name('technician.reject');

        Route::get('/distributor-orders', [DistributorOrderController::class, 'index'])->name('distributor-orders.index');
        Route::get('/distributor-orders/create', [DistributorOrderController::class, 'create'])->name('distributor-orders.create');
        Route::post('/distributor-orders', [DistributorOrderController::class, 'store'])->name('distributor-orders.store');
        Route::get('/distributor-orders/products/{product}/pricing', [DistributorOrderController::class, 'productPricing'])->name('distributor-orders.products.pricing');
        Route::get('/distributor-orders/products/{product}/serials', [DistributorOrderController::class, 'productSerials'])->name('distributor-orders.products.serials');
        Route::get('/distributor-orders/{distributor_order}', [DistributorOrderController::class, 'show'])->name('distributor-orders.show');
        Route::get('/distributor-orders/{distributor_order}/invoice', [DistributorOrderController::class, 'invoice'])->name('distributor-orders.invoice');
        Route::get('/distributor-orders/{distributor_order}/approve', [DistributorOrderController::class, 'approveForm'])->name('distributor-orders.approve.form');
        Route::patch('/distributor-orders/{distributor_order}/approve', [DistributorOrderController::class, 'approve'])->name('distributor-orders.approve');
        Route::patch('/distributor-orders/{distributor_order}/reject', [DistributorOrderController::class, 'reject'])->name('distributor-orders.reject');
        Route::post('/distributor-orders/{distributor_order}/payments', [DistributorOrderPaymentController::class, 'store'])->name('distributor-orders.payments.store');
        // Route::resource('/seller', SellerController::class);

        Route::resource('/user', UserController::class);
        Route::resource('/userQuery', UserQueryController::class);
        Route::resource('/productEnquiry', ProductEnquiryController::class);
        Route::resource('/order', OrderController::class)->only(['index', 'show']);
        Route::resource('/important_links', ImportantLinkController::class);
        // Route::resource('/team', TeamController::class);
        // Route::resource('/testimonial', TestimonialController::class);
        // Route::resource('/portfolio', PortfolioController::class);
        Route::resource('/faq', FaqController::class);
        Route::resource('/product_category', ProductCategoryController::class);
        Route::resource('/product', ProductController::class);
        Route::get('/product/{product}/warranty/edit', [ProductWarrantyController::class, 'edit'])->name('product.warranty.edit');
        Route::put('/product/{product}/warranty', [ProductWarrantyController::class, 'update'])->name('product.warranty.update');
        Route::delete('/product/{product}/warranty', [ProductWarrantyController::class, 'destroy'])->name('product.warranty.destroy');
        Route::resource('/promo-code', PromoCodeController::class);

        // Review moderation routes
        Route::get('/reviews/moderation', [ReviewModerationController::class, 'index'])->name('reviews.moderation');
        Route::patch('/reviews/{review}/approve', [ReviewModerationController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{review}/reject', [ReviewModerationController::class, 'reject'])->name('reviews.reject');

        // Route::get('/newsletter', [NewsletterController::class, 'index'])->name('newsletter.index');

        // Route::resource('/gallery', GalleryController::class);
        require __DIR__.'/laraship.php';
        Route::resource('/product-page-banner', ProductPageBannerController::class);

        // Recommendation configuration routes
        Route::get('/recommendation-config', [RecommendationConfigController::class, 'index'])->name('recommendation-config.index');
        Route::patch('/recommendation-config', [RecommendationConfigController::class, 'update'])->name('recommendation-config.update');

        // Serial number lookup and management
        Route::get('/serial-numbers/lookup', [SerialNumberController::class, 'lookup'])->name('serial-numbers.lookup');
        Route::get('/serial-numbers/damaged', [DamagedStolenSerialController::class, 'damaged'])->name('serial-numbers.damaged');
        Route::get('/serial-numbers/stolen', [DamagedStolenSerialController::class, 'stolen'])->name('serial-numbers.stolen');
        Route::get('/serial-numbers/{serialNumber}', [SerialNumberController::class, 'show'])->name('serial-numbers.show');
        Route::post('/serial-numbers/{serialNumber}/mark-stolen', [SerialNumberController::class, 'markStolen'])->name('serial-numbers.mark-stolen');
        Route::post('/serial-numbers/{serialNumber}/mark-damaged', [SerialNumberController::class, 'markDamaged'])->name('serial-numbers.mark-damaged');

        require __DIR__.'/stock.php';
    });
    require __DIR__.'/auth.php';
    require __DIR__.'/settings.php';
});

// Laraship Webhook Routes - Must be outside admin auth middleware
require __DIR__.'/laraship_webhook.php';
