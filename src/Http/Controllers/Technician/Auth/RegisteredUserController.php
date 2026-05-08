<?php

namespace App\Http\Controllers\Technician\Auth;

use App\Events\TechnicianRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterTechnicianRequest;
use App\Models\State;
use App\Models\Technician;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return $this->render('technician/auth/register', [
            'submitUrl' => route('technician.register'),
            'canResetPassword' => Route::has('technician.password.request'),
            'specializations' => [
                ['value' => 'ac_refrigeration', 'label' => 'AC & Refrigeration'],
                ['value' => 'electrical', 'label' => 'Electrical'],
                ['value' => 'plumbing', 'label' => 'Plumbing'],
                ['value' => 'carpentry', 'label' => 'Carpentry'],
                ['value' => 'painting', 'label' => 'Painting'],
                ['value' => 'welding', 'label' => 'Welding'],
                ['value' => 'solar_installation', 'label' => 'Solar Installation'],
                ['value' => 'cctv_security', 'label' => 'CCTV & Security Systems'],
                ['value' => 'it_networking', 'label' => 'IT & Networking'],
                ['value' => 'other', 'label' => 'Other'],
            ],
            'idTypes' => [
                ['value' => 'aadhaar', 'label' => 'Aadhaar'],
                ['value' => 'passport', 'label' => 'Passport'],
                ['value' => 'voter_id', 'label' => 'Voter ID'],
                ['value' => 'drivers_license', 'label' => "Driver's License"],
                ['value' => 'national_id', 'label' => 'National ID'],
                ['value' => 'other', 'label' => 'Other Government ID'],
            ],
            'states' => State::orderBy('name')->get(['id', 'name', 'gst_state_code'])
                ->map(fn ($s) => ['value' => (string) $s->id, 'label' => "{$s->name} ({$s->gst_state_code})"])
                ->all(),
        ]);
    }

    public function store(RegisterTechnicianRequest $request): RedirectResponse
    {
        $data = $request->validated();
        unset($data['password_confirmation']);
        $data['application_status'] = Technician::STATUS_PENDING;

        $technician = Technician::create($data);

        TechnicianRegistered::dispatch($technician);

        return redirect()
            ->route('technician.login')
            ->with('status', 'registration-pending');
    }
}
