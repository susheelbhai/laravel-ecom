<?php

namespace App\Http\Controllers\Distributor\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    public function __invoke(Request $request): RedirectResponse|Response|View
    {
        return $request->user('distributor')->hasVerifiedEmail()
                    ? redirect()->intended(route('distributor.dashboard', absolute: false))
                    : $this->render('distributor.auth.verify-email');
    }
}
