<?php

namespace App\Http\Controllers\Technician;

use App\Http\Controllers\Controller;
use App\Http\Requests\TechnicianProfileUpdateRequest;
use App\Models\Technician;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $data = $request->user('technician');
        $status = $request->session()->get('status');

        return $this->render('technician/settings/profile', [
            'data' => $data,
            'status' => $status,
            'mustVerifyEmail' => false,
        ]);
    }

    public function update(TechnicianProfileUpdateRequest $request): RedirectResponse
    {
        $request->user('technician')->fill($request->validated());

        if ($request->user('technician')->isDirty('email')) {
            $request->user('technician')->email_verified_at = null;
        }

        $technician = Technician::find(Auth::guard('technician')->user()->id);
        $technician->name = $request->name;
        $technician->phone = $request->phone;
        $technician->email = $request->email;
        $technician->save();

        if ($request->hasFile('profile_pic')) {
            $technician->clearMediaCollection('profile_pic');
            $technician->addMediaFromRequest('profile_pic')
                ->toMediaCollection('profile_pic');
        }

        return Redirect::route('technician.profile.edit')->with('success', 'profile-updated');
    }
}
