<?php

namespace App\Http\Controllers\Distributor;

use App\Events\DealerSubmittedForApproval;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDealerRequest;
use App\Models\Dealer;
use App\Models\DealerOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class DealerController extends Controller
{
    public function index()
    {
        $distributorId = Auth::guard('distributor')->id();

        $data = Dealer::query()
            ->where('distributor_id', $distributorId)
            ->latest('id')
            ->paginate(15)
            ->through(function (Dealer $dealer) {
                return [
                    'id' => $dealer->id,
                    'name' => $dealer->name,
                    'email' => $dealer->email,
                    'phone' => $dealer->phone,
                    'application_status' => $dealer->application_status,
                    'created_at' => $dealer->created_at?->format('M d, Y'),
                ];
            });

        return $this->render('distributor/resources/dealer/index', compact('data'));
    }

    public function show(Dealer $dealer)
    {
        $distributorId = Auth::guard('distributor')->id();
        abort_unless($dealer->distributor_id === $distributorId, 403);

        $totalOutstandingBalance = (float) DealerOrder::query()
            ->where('dealer_id', $dealer->id)
            ->where('distributor_id', $distributorId)
            ->sum(DB::raw('total_amount - amount_paid'));

        $data = [
            'id' => $dealer->id,
            'name' => $dealer->name,
            'email' => $dealer->email,
            'phone' => $dealer->phone,
            'application_status' => $dealer->application_status,
            'created_at' => $dealer->created_at?->format('M d, Y'),
            'total_outstanding_balance' => $totalOutstandingBalance,
        ];

        return $this->render('distributor/resources/dealer/show', compact('data'));
    }

    public function create()
    {
        return $this->render('distributor/resources/dealer/create');
    }

    public function store(StoreDealerRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        unset($payload['password_confirmation']);
        $payload['distributor_id'] = Auth::guard('distributor')->id();
        $payload['application_status'] = Dealer::STATUS_PENDING;

        $dealer = Dealer::create($payload);

        DealerSubmittedForApproval::dispatch($dealer);

        return Redirect::route('distributor.dealer.index')
            ->with('success', 'Dealer invited. They can sign in after an administrator approves the account.');
    }
}
