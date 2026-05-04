<?php

namespace App\Http\Controllers\Dealer\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    public function __invoke(Request $request): RedirectResponse|Response|View
    {
        return $request->user('dealer')->hasVerifiedEmail()
                    ? redirect()->intended(route('dealer.dashboard', absolute: false))
                    : $this->render('dealer.auth.verify-email');
    }
}
