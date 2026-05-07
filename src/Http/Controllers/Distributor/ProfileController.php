<?php

namespace App\Http\Controllers\Distributor;

use App\Http\Controllers\Controller;
use App\Http\Requests\DistributorProfileUpdateRequest;
use App\Models\Distributor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $data = $request->user('distributor');
        $status = $request->session()->get('status');

        return $this->render('distributor/settings/profile', [
            'data' => $data,
            'status' => $status,
            'mustVerifyEmail' => false,
        ]);
    }

    public function update(DistributorProfileUpdateRequest $request): RedirectResponse
    {
        $request->user('distributor')->fill($request->validated());

        if ($request->user('distributor')->isDirty('email')) {
            $request->user('distributor')->email_verified_at = null;
        }

        $distributor = Distributor::find(Auth::guard('distributor')->user()->id);
        $distributor->name = $request->name;
        $distributor->phone = $request->phone;
        $distributor->email = $request->email;
        $distributor->commission_percentage = $request->input('commission_percentage', 0);
        $distributor->save();

        if ($request->hasFile('profile_pic')) {
            $distributor->clearMediaCollection('profile_pic');
            $distributor->addMediaFromRequest('profile_pic')
                ->toMediaCollection('profile_pic');
        }

        return Redirect::route('distributor.profile.edit')->with('success', 'profile-updated');
    }
}
