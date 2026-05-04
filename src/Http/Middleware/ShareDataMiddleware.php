<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use App\Models\Dealer;
use App\Models\Distributor;
use App\Models\ImportantLink;
use App\Models\Partner;
use App\Models\Review;
use App\Models\Seller;
use App\Models\Setting;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareDataMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Inertia::share([
            'auth' => function () {
                /** @var User $user */
                $user = Auth::user();
                $unreadNotifications = $user ? $user->unreadNotifications()->take(10)->get()->map(function ($n) {
                    return $n->toArray();
                }) : [];
                $unreadCount = $user ? count($unreadNotifications) : 0;

                return [
                    'user' => $user, // Default guard
                    'dashboard_url' => route('dashboard'),
                    'unread_notifications_count' => $unreadCount,
                    'unread_notifications' => $unreadNotifications,
                ];
            },
            'admin' => function () {
                /** @var Admin $user */
                $user = Auth::guard('admin')->user();
                $unreadNotifications = $user ? $user->unreadNotifications()->take(10)->get()->map(function ($n) {
                    return $n->toArray();
                }) : [];
                $unreadCount = $user ? count($unreadNotifications) : 0;
                $pendingReviewsCount = $user ? Review::where('status', 'pending')->count() : 0;

                return [
                    'user' => $user, // Admin guard
                    'permissions' => $user?->getAllPermissions()->pluck('name'),
                    'dashboard_url' => route('admin.dashboard'),
                    'unread_notifications_count' => $unreadCount,
                    'unread_notifications' => $unreadNotifications,
                    'pending_reviews_count' => $pendingReviewsCount,
                ];
            },
            'partner' => function () {
                /** @var Partner $user */
                $user = Auth::guard('partner')->user();
                $unreadNotifications = $user ? $user->unreadNotifications()->take(10)->get()->map(function ($n) {
                    return $n->toArray();
                }) : [];
                $unreadCount = $user ? count($unreadNotifications) : 0;

                return [
                    'user' => $user, // Partner guard
                    'permissions' => $user?->getAllPermissions()->pluck('name'),
                    'dashboard_url' => route('partner.dashboard'),
                    'unread_notifications_count' => $unreadCount,
                    'unread_notifications' => $unreadNotifications,
                ];
            },
            'seller' => function () {
                /** @var Seller $user */
                $user = Auth::guard('seller')->user();
                $unreadNotifications = $user ? $user->unreadNotifications()->take(10)->get()->map(function ($n) {
                    return $n->toArray();
                }) : [];
                $unreadCount = $user ? count($unreadNotifications) : 0;

                return [
                    'user' => $user, // Seller guard
                    'permissions' => $user?->getAllPermissions()->pluck('name'),
                    'dashboard_url' => route('seller.dashboard'),
                    'unread_notifications_count' => $unreadCount,
                    'unread_notifications' => $unreadNotifications,
                ];
            },
            'distributor' => function () {
                /** @var Distributor $user */
                $user = Auth::guard('distributor')->user();
                $unreadNotifications = $user ? $user->unreadNotifications()->take(10)->get()->map(function ($n) {
                    return $n->toArray();
                }) : [];
                $unreadCount = $user ? count($unreadNotifications) : 0;

                return [
                    'user' => $user,
                    'permissions' => $user?->getAllPermissions()->pluck('name'),
                    'dashboard_url' => route('distributor.dashboard'),
                    'unread_notifications_count' => $unreadCount,
                    'unread_notifications' => $unreadNotifications,
                ];
            },
            'dealer' => function () {
                /** @var Dealer $user */
                $user = Auth::guard('dealer')->user();
                $unreadNotifications = $user ? $user->unreadNotifications()->take(10)->get()->map(function ($n) {
                    return $n->toArray();
                }) : [];
                $unreadCount = $user ? count($unreadNotifications) : 0;

                return [
                    'user' => $user,
                    'permissions' => $user?->getAllPermissions()->pluck('name'),
                    'dashboard_url' => route('dealer.dashboard'),
                    'unread_notifications_count' => $unreadCount,
                    'unread_notifications' => $unreadNotifications,
                ];
            },
        ]);

        $settings = Setting::find(1);
        $important_link = ImportantLink::whereIsActive(1)->latest()->get();
        config([
            'important_links' => $important_link,
        ]);
        if ($settings) {
            config([
                'app.name' => $settings->app_name,
                'app.favicon' => $settings->favicon,
                'app.dark_logo' => $settings->dark_logo,
                'app.light_logo' => $settings->light_logo,
                'app.square_dark_logo' => $settings->square_dark_logo,
                'app.square_light_logo' => $settings->square_light_logo,
                'app.email' => $settings->email,
                'app.phone' => $settings->phone,
                'app.facebook' => $settings->facebook,
                'app.twitter' => $settings->twitter,
                'app.instagram' => $settings->instagram,
                'app.linkedin' => $settings->linkedin,
                'app.youtube' => $settings->youtube,
                'app.whatsapp' => '91'.$settings->whatsapp,
                'app.address' => $settings->address,
            ]);
        }

        return $next($request);
    }
}
