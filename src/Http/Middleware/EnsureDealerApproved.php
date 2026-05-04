<?php

namespace App\Http\Middleware;

use App\Models\Dealer;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureDealerApproved
{
    /**
     * @param  Closure(Request): mixed  $next
     */
    public function handle(Request $request, Closure $next)
    {
        /** @var Dealer|null $dealer */
        $dealer = Auth::guard('dealer')->user();

        if (! $dealer) {
            return $next($request);
        }

        if (! $dealer->isApproved()) {
            Auth::guard('dealer')->logout();

            return redirect()
                ->route('dealer.login')
                ->with('warning', 'Your dealer account is not approved yet.');
        }

        return $next($request);
    }
}

