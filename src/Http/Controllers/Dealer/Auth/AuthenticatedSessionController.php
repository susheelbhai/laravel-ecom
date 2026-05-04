<?php

namespace App\Http\Controllers\Dealer\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\DealerLoginRequest;
use App\Models\Dealer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request)
    {
        return $this->render('dealer/auth/login', [
            'submitUrl' => route('dealer.login'),
            'canResetPassword' => Route::has('dealer.password.request'),
            'status' => $request->session()->get('status'),
            'socialData' => collect([])->values()->all(),
        ]);
    }

    public function store(DealerLoginRequest $request): RedirectResponse
    {
        $user = Dealer::where('email', $request->input('email'))
            ->orWhere('phone', $request->input('email'))
            ->first();

        if ($user && $user->application_status === Dealer::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'email' => __('Your account is pending administrator approval.'),
            ]);
        }

        if ($user && $user->application_status === Dealer::STATUS_REJECTED) {
            throw ValidationException::withMessages([
                'email' => __('Your dealer application was not approved.'),
            ]);
        }

        $request->authenticate($user, 'dealer');

        $request->session()->regenerate();

        return redirect()->intended(route('dealer.dashboard', absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('dealer')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('dealer.login');
    }
}
