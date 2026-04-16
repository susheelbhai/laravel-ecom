<?php

namespace App\Http\Controllers\User\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request)
    {
        $socialData = collect(config('services.supportedSocialProviders.user'))->map(function ($item, $key) {
            return [
                $key => [
                    'driver' => $item['driver'],
                    'href' => route('social.login', $key),
                ],
            ];
        })->values();

        return $this->render('user/auth/login', [
            'submitUrl' => route('login'),
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'socialData' => $socialData,
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $user = User::whereEmail($request['email'])
            ->orWhere('phone', $request['email'])
            ->first();
        $request->authenticate($user, 'web');
        $request->session()->regenerate();

        // Migrate guest cart: add user_id to cart with matching IP address
        $ipAddress = $request->ip();
        $guestCart = Cart::where('user_id', null)
            ->where('ip_address', $ipAddress)
            ->first();

        if ($guestCart) {
            $guestCart->update(['user_id' => Auth::id()]);
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
