<?php

namespace App\Http\Requests;

use App\Models\Dealer;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;

class DealerEmailVerificationRequest extends EmailVerificationRequest
{
    /**
     * @param  string|null  $guard
     * @return Dealer|null
     */
    public function user($guard = null)
    {
        return Auth::guard('dealer')->user();
    }
}
