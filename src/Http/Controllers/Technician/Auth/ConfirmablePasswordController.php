<?php

namespace App\Http\Controllers\Technician\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    public function show(): Response|View
    {
        return $this->render('technician.auth.confirm-password');
    }

    public function store(Request $request): RedirectResponse
    {
        if (! Auth::guard('technician')->validate([
            'email' => $request->user('technician')->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended(route('technician.dashboard', absolute: false));
    }
}
