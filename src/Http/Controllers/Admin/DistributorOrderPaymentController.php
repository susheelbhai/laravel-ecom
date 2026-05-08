<?php

namespace App\Http\Controllers\Admin;

use App\Events\DistributorOrderPaymentRecorded;
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

        $payment = $paymentService->recordDistributorOrderPayment(
            $distributor_order,
            $request->validated(),
            $admin,
        );

        DistributorOrderPaymentRecorded::dispatch($distributor_order->fresh(), $payment, $admin);

        return redirect()
            ->route('admin.distributor-orders.show', $distributor_order)
            ->with('success', 'Payment recorded successfully.');
    }
}
