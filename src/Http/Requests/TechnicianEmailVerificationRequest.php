<?php

namespace App\Http\Requests;

use App\Models\Technician;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;

class TechnicianEmailVerificationRequest extends EmailVerificationRequest
{
    /**
     * @param  string|null  $guard
     * @return Technician|null
     */
    public function user($guard = null)
    {
        return Auth::guard('technician')->user();
    }
}
