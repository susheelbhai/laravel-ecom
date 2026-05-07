<?php

namespace App\Http\Controllers\Distributor;

use App\Http\Controllers\Controller;
use App\Http\Requests\B2B\StoreDealerOrderPaymentRequest;
use App\Models\DealerOrder;
use App\Services\B2BPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class DealerOrderPaymentController extends Controller
{
    public function store(
        StoreDealerOrderPaymentRequest $request,
        DealerOrder $dealer_order,
        B2BPaymentService $paymentService,
    ): RedirectResponse {
        $distributor = Auth::guard('distributor')->user();
        abort_unless($distributor, 401);

        abort_unless(
            $dealer_order->distributor_id === $distributor->id,
            403,
            'You are not authorised to record payments for this order.'
        );

        $paymentService->recordDealerOrderPayment(
            $dealer_order,
            $request->validated(),
            $distributor,
        );

        return redirect()
            ->route('distributor.dealer-orders.show', $dealer_order)
            ->with('success', 'Payment recorded successfully.');
    }
}
