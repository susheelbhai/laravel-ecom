<?php

namespace App\Http\Controllers\Technician\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    public function __invoke(Request $request): RedirectResponse|Response|View
    {
        return $request->user('technician')->hasVerifiedEmail()
                    ? redirect()->intended(route('technician.dashboard', absolute: false))
                    : $this->render('technician.auth.verify-email');
    }
}
