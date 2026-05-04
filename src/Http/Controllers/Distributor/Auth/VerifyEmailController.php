<?php

namespace App\Http\Controllers\Distributor\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\DistributorEmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    public function __invoke(DistributorEmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('distributor.dashboard', absolute: false).'?verified=1');
        }

        $request->fulfill();

        return redirect()->intended(route('distributor.dashboard', absolute: false).'?verified=1');
    }
}
