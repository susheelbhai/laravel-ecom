<?php

namespace App\Http\Controllers\Distributor\Auth;

use App\Events\DistributorRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterDistributorRequest;
use App\Models\Distributor;
use App\Models\State;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return $this->render('distributor/auth/register', [
            'submitUrl' => route('distributor.register'),
            'canResetPassword' => Route::has('distributor.password.request'),
            'businessConstitutions' => [
                ['value' => 'sole_proprietorship', 'label' => 'Sole proprietorship'],
                ['value' => 'partnership', 'label' => 'Partnership'],
                ['value' => 'llp', 'label' => 'LLP'],
                ['value' => 'private_limited', 'label' => 'Private limited'],
                ['value' => 'public_limited', 'label' => 'Public limited'],
                ['value' => 'opc', 'label' => 'One person company (OPC)'],
                ['value' => 'trust_society', 'label' => 'Trust / society'],
                ['value' => 'other', 'label' => 'Other'],
            ],
            'kycIdTypes' => [
                ['value' => 'passport', 'label' => 'Passport'],
                ['value' => 'national_id', 'label' => 'National ID'],
                ['value' => 'aadhaar', 'label' => 'Aadhaar'],
                ['value' => 'voter_id', 'label' => 'Voter ID'],
                ['value' => 'drivers_license', 'label' => "Driver's license"],
                ['value' => 'other', 'label' => 'Other government ID'],
            ],
            'purchaseBands' => [
                ['value' => 'under_1l', 'label' => 'Under ₹1 lakh'],
                ['value' => '1l_5l', 'label' => '₹1 lakh – ₹5 lakh'],
                ['value' => '5l_25l', 'label' => '₹5 lakh – ₹25 lakh'],
                ['value' => '25l_1cr', 'label' => '₹25 lakh – ₹1 crore'],
                ['value' => 'above_1cr', 'label' => 'Above ₹1 crore'],
            ],
            'states' => State::orderBy('name')->get(['id', 'name', 'gst_state_code'])
                ->map(fn ($s) => ['value' => (string) $s->id, 'label' => "{$s->name} ({$s->gst_state_code})"])
                ->all(),
        ]);
    }

    public function store(RegisterDistributorRequest $request): RedirectResponse
    {
        $data = $request->validated();
        unset($data['password_confirmation']);
        $data['application_status'] = Distributor::STATUS_PENDING;

        $distributor = Distributor::create($data);

        DistributorRegistered::dispatch($distributor);

        return redirect()
            ->route('distributor.login')
            ->with('status', 'registration-pending');
    }
}
