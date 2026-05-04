<?php

namespace App\Http\Requests;

use App\Models\Distributor;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;

class DistributorEmailVerificationRequest extends EmailVerificationRequest
{
    /**
     * @param  string|null  $guard
     * @return Distributor|null
     */
    public function user($guard = null)
    {
        return Auth::guard('distributor')->user();
    }
}
