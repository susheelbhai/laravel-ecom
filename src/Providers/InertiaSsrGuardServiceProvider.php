<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class InertiaSsrGuardServiceProvider extends ServiceProvider
{
    /**
     * When `public/hot` exists, Inertia SSR posts to the Vite dev server. A stale
     * hot file (or an SSR endpoint that never responds) makes full page loads wait
     * for the HTTP client timeout. Disable SSR during Vite HMR unless explicitly
     * opted in via `inertia.ssr.allow_with_vite_hot` / INERTIA_SSR_WITH_VITE_HOT.
     */
    public function boot(): void
    {
        if (! config('inertia.ssr.enabled', false)) {
            return;
        }

        if (! class_exists(Inertia::class) || ! Vite::isRunningHot()) {
            return;
        }

        if (config('inertia.ssr.allow_with_vite_hot', false)) {
            return;
        }

        Inertia::disableSsr(true);
    }
}
