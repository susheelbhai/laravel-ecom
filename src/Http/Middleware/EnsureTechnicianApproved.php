<?php

namespace App\Http\Middleware;

use App\Models\Technician;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureTechnicianApproved
{
    /**
     * @param  Closure(Request): mixed  $next
     */
    public function handle(Request $request, Closure $next)
    {
        /** @var Technician|null $technician */
        $technician = Auth::guard('technician')->user();

        if (! $technician) {
            return $next($request);
        }

        if (! $technician->isApproved()) {
            Auth::guard('technician')->logout();

            return redirect()
                ->route('technician.login')
                ->with('warning', 'Your technician account is not approved yet.');
        }

        return $next($request);
    }
}
