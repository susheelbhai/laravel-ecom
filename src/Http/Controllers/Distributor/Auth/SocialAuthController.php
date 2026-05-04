<?php

namespace App\Http\Controllers\Distributor\Auth;

use App\Http\Controllers\Controller;
use App\Models\Distributor;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * @var array<string, array{driver: string}>
     */
    protected array $supportedProviders;

    public function __construct()
    {
        $this->supportedProviders = config('services.supportedSocialProviders.distributor');
        foreach ($this->supportedProviders as $provider => $data) {
            $driver = $data['driver'];
            $redirectRoute = route('distributor.social.callback', $provider);
            Config::set("services.{$driver}.redirect", $redirectRoute);
        }
    }

    public function redirectToProvider(string $provider)
    {
        if (! array_key_exists($provider, $this->supportedProviders)) {
            abort(404);
        }

        $driver = $this->supportedProviders[$provider]['driver'];

        return Socialite::driver($driver)->redirect();
    }

    public function handleProviderCallback(string $provider)
    {
        if (! array_key_exists($provider, $this->supportedProviders)) {
            abort(404);
        }
        try {
            $driver = $this->supportedProviders[$provider]['driver'];
            $socialUser = Socialite::driver($driver)->user();
            $distributor = Distributor::where('email', $socialUser->getEmail())->first();

            if (! $distributor) {
                return redirect()->route('distributor.login')->with(['error' => "No distributor account associated with this {$provider} account."]);
            }

            if ($distributor->application_status === Distributor::STATUS_PENDING) {
                return redirect()->route('distributor.login')->with(['error' => __('Your registration is pending administrator approval.')]);
            }

            if ($distributor->application_status === Distributor::STATUS_REJECTED) {
                return redirect()->route('distributor.login')->with(['error' => __('Your distributor application was not approved.')]);
            }

            Auth::guard('distributor')->login($distributor);

            return redirect()->intended(route('distributor.dashboard'));
        } catch (\Exception $e) {
            $providerName = ucfirst($provider);

            return redirect()->route('distributor.login')->with(['error' => "Unable to login with {$providerName}."]);
        }
    }
}
