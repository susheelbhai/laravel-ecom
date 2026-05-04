<?php

namespace App\Http\Middleware;

use App\Models\Distributor;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureDistributorApproved
{
    /**
     * @param  Closure(Request): mixed  $next
     */
    public function handle(Request $request, Closure $next)
    {
        /** @var Distributor|null $distributor */
        $distributor = Auth::guard('distributor')->user();

        if (! $distributor) {
            return $next($request);
        }

        if (! $distributor->isApproved()) {
            Auth::guard('distributor')->logout();

            return redirect()
                ->route('distributor.login')
                ->with('warning', 'Your distributor account is not approved yet.');
        }

        return $next($request);
    }
}

