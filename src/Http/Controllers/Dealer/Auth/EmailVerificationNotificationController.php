<?php

namespace App\Http\Controllers\Dealer\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        if ($request->user('dealer')->hasVerifiedEmail()) {
            return redirect()->intended(route('dealer.dashboard', absolute: false));
        }

        $request->user('dealer')->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
