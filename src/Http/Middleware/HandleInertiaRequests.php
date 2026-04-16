<?php

namespace App\Http\Middleware;

use App\Helpers\CartHelper;
use App\Models\PageAuth;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $setting = \App\Models\Setting::find(1);

        return [
            ...parent::share($request),
            'appData' => [
                'debug' => config('app.debug'),
                'name' => config('app.name'),
                'favicon' => config('app.favicon'),
                'dark_logo' => config('app.dark_logo'),
                'light_logo' => config('app.light_logo'),
                'square_dark_logo' => config('app.square_dark_logo'),
                'square_light_logo' => config('app.square_light_logo'),
                'email' => config('app.email'),
                'phone' => config('app.phone'),
                'whatsapp' => config('app.whatsapp'),
                'facebook' => config('app.facebook'),
                'twitter' => config('app.twitter'),
                'instagram' => config('app.instagram'),
                'linkedin' => config('app.linkedin'),
                'youtube' => config('app.youtube'),
                'apiUrl' => config('app.url'),
                'address' => config('app.address'),
                'trust_badges' => $setting?->trust_badges,
            ],
            'important_links' => config('important_links'),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'settings' => PageAuth::where('id', 1)->first(),
            ],
            'cartCount' => $this->getCartCount($request),
            'wishlistCount' => $this->getWishlistCount($request),
            'cartProductIds' => $this->getCartProductIds($request),
            'wishlistProductIds' => $this->getWishlistProductIds($request),
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'warning' => fn () => $request->session()->get('warning'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
                'status_class' => fn () => $request->session()->get('status_class'),
            ],
        ];
    }

    private function getCartCount(Request $request): int
    {
        return CartHelper::getCartCount($request);
    }

    private function getWishlistCount(Request $request): int
    {
        if (! $request->user()) {
            return 0;
        }

        $wishlist = \App\Models\Wishlist::where('user_id', $request->user()->id)->first();

        if (! $wishlist) {
            return 0;
        }

        return $wishlist->items()->count() ?? 0;
    }

    private function getCartProductIds(Request $request): array
    {
        return CartHelper::getCartProductIds($request);
    }

    private function getWishlistProductIds(Request $request): array
    {
        if (! $request->user()) {
            return [];
        }

        $wishlist = \App\Models\Wishlist::where('user_id', $request->user()->id)->first();

        if (! $wishlist) {
            return [];
        }

        return $wishlist->items()->pluck('product_id')->toArray();
    }
}
