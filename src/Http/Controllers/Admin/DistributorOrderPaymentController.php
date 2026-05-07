<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\B2B\StoreDistributorOrderPaymentRequest;
use App\Models\DistributorOrder;
use App\Services\B2BPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class DistributorOrderPaymentController extends Controller
{
    public function store(
        StoreDistributorOrderPaymentRequest $request,
        DistributorOrder $distributor_order,
        B2BPaymentService $paymentService,
    ): RedirectResponse {
        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 401);

        $paymentService->recordDistributorOrderPayment(
            $distributor_order,
            $request->validated(),
            $admin,
        );

        return redirect()
            ->route('admin.distributor-orders.show', $distributor_order)
            ->with('success', 'Payment recorded successfully.');
    }
}
