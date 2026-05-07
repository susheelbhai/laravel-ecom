<?php

namespace App\Http\Controllers\Technician\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        if ($request->user('technician')->hasVerifiedEmail()) {
            return redirect()->intended(route('technician.dashboard', absolute: false));
        }

        $request->user('technician')->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
