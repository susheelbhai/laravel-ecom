<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Http\Requests\DealerProfileUpdateRequest;
use App\Models\Dealer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $data = $request->user('dealer');
        $status = $request->session()->get('status');

        return $this->render('dealer/settings/profile', [
            'data' => $data,
            'status' => $status,
            'mustVerifyEmail' => false,
        ]);
    }

    public function update(DealerProfileUpdateRequest $request): RedirectResponse
    {
        $request->user('dealer')->fill($request->validated());

        if ($request->user('dealer')->isDirty('email')) {
            $request->user('dealer')->email_verified_at = null;
        }

        $dealer = Dealer::find(Auth::guard('dealer')->user()->id);
        $dealer->name = $request->name;
        $dealer->phone = $request->phone;
        $dealer->email = $request->email;
        $dealer->commission_percentage = $request->input('commission_percentage', 0);
        $dealer->save();

        if ($request->hasFile('profile_pic')) {
            $dealer->clearMediaCollection('profile_pic');
            $dealer->addMediaFromRequest('profile_pic')
                ->toMediaCollection('profile_pic');
        }

        return Redirect::route('dealer.profile.edit')->with('success', 'profile-updated');
    }
}
