<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Auth::user()->addresses()->orderBy('is_default', 'desc')->orderBy('created_at', 'desc')->get();

        return $this->render('user/addresses/index', [
            'addresses' => $addresses,
        ]);
    }

    public function create()
    {
        return $this->render('user/addresses/form', [
            'address' => null,
        ]);
    }

    public function store(AddressRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        // If user has no addresses yet, make this one default
        if (Auth::user()->addresses()->count() === 0) {
            $data['is_default'] = true;
        }

        // If this address is set as default, unset all other defaults
        if ($data['is_default'] ?? false) {
            Auth::user()->addresses()->update(['is_default' => false]);
        }

        Address::create($data);

        return redirect()->route('addresses.index')->with('success', 'Address added successfully.');
    }

    public function edit(Address $address)
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        return $this->render('user/addresses/form', [
            'address' => $address,
        ]);
    }

    public function update(AddressRequest $request, Address $address): RedirectResponse
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validated();

        // If this address is set as default, unset all other defaults
        if ($request->is_default) {
            Auth::user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($data);

        return redirect()->route('addresses.index')->with('success', 'Address updated successfully.');
    }

    public function destroy(Address $address): RedirectResponse
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $address->delete();

        return redirect()->route('addresses.index')->with('success', 'Address deleted successfully.');
    }

    public function setDefault(Address $address): RedirectResponse
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        // Unset all other defaults
        Auth::user()->addresses()->update(['is_default' => false]);

        // Set this address as default
        $address->update(['is_default' => true]);

        return redirect()->route('addresses.index')->with('success', 'Default address updated.');
    }
}
