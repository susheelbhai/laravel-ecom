<?php

namespace App\Http\Controllers\Technician;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class HomeController extends Controller
{
    public function dashboard(Request $request)
    {
        return $this->render('technician/dashboard', [
            'submitUrl' => route('technician.login'),
            'canResetPassword' => Route::has('technician.password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }
}
