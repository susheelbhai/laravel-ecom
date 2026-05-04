<?php

namespace App\Http\Controllers\Distributor\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        if ($request->user('distributor')->hasVerifiedEmail()) {
            return redirect()->intended(route('distributor.dashboard', absolute: false));
        }

        $request->user('distributor')->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
