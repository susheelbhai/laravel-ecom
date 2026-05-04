<?php

namespace App\Http\Controllers\Distributor\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\DistributorLoginRequest;
use App\Models\Distributor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request)
    {
        $socialData = collect(config('services.supportedSocialProviders.distributor'))->map(function ($item, $key) {
            return [
                $key => [
                    'driver' => $item['driver'],
                    'href' => route('distributor.social.login', $key),
                ],
            ];
        })->values();

        return $this->render('distributor/auth/login', [
            'submitUrl' => route('distributor.login'),
            'canResetPassword' => Route::has('distributor.password.request'),
            'status' => $request->session()->get('status'),
            'socialData' => $socialData,
        ]);
    }

    public function store(DistributorLoginRequest $request): RedirectResponse
    {
        $user = Distributor::where('email', $request->input('email'))
            ->orWhere('phone', $request->input('email'))
            ->first();

        if ($user && $user->application_status === Distributor::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'email' => __('Your registration is pending administrator approval.'),
            ]);
        }

        if ($user && $user->application_status === Distributor::STATUS_REJECTED) {
            throw ValidationException::withMessages([
                'email' => __('Your distributor application was not approved.'),
            ]);
        }

        $request->authenticate($user, 'distributor');

        $request->session()->regenerate();

        return redirect()->intended(route('distributor.dashboard', absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('distributor')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('distributor.login');
    }
}
