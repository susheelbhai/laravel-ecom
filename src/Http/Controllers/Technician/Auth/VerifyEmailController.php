<?php

namespace App\Http\Controllers\Technician\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\TechnicianEmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    public function __invoke(TechnicianEmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('technician.dashboard', absolute: false).'?verified=1');
        }

        $request->fulfill();

        return redirect()->intended(route('technician.dashboard', absolute: false).'?verified=1');
    }
}
