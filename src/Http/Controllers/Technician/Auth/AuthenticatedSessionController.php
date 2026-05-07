<?php

namespace App\Http\Controllers\Technician\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TechnicianLoginRequest;
use App\Models\Technician;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request)
    {
        return $this->render('technician/auth/login', [
            'submitUrl' => route('technician.login'),
            'canResetPassword' => Route::has('technician.password.request'),
            'status' => $request->session()->get('status'),
            'socialData' => collect([])->values()->all(),
        ]);
    }

    public function store(TechnicianLoginRequest $request): RedirectResponse
    {
        $user = Technician::where('email', $request->input('email'))
            ->orWhere('phone', $request->input('email'))
            ->first();

        if ($user && $user->application_status === Technician::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'email' => __('Your account is pending administrator approval.'),
            ]);
        }

        if ($user && $user->application_status === Technician::STATUS_REJECTED) {
            throw ValidationException::withMessages([
                'email' => __('Your technician application was not approved.'),
            ]);
        }

        $request->authenticate($user, 'technician');

        $request->session()->regenerate();

        return redirect()->intended(route('technician.dashboard', absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('technician')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('technician.login');
    }
}
