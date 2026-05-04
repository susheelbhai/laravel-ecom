<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class HomeController extends Controller
{
    public function dashboard(Request $request)
    {
        return $this->render('dealer/dashboard', [
            'submitUrl' => route('dealer.login'),
            'canResetPassword' => Route::has('dealer.password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }
}
