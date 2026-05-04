<?php

namespace App\Http\Controllers\Distributor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class HomeController extends Controller
{
    public function dashboard(Request $request)
    {
        return $this->render('distributor/dashboard', [
            'submitUrl' => route('distributor.login'),
            'canResetPassword' => Route::has('distributor.password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }
}
