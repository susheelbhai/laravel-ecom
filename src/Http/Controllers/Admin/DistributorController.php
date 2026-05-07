<?php

namespace App\Http\Controllers\Admin;

use App\Events\DistributorApplicationApproved;
use App\Events\DistributorApplicationRejected;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Distributor;
use App\Models\DistributorOrder;
use App\Services\Inventory\DefaultLocationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DistributorController extends Controller
{
    public function index()
    {
        $data = Distributor::query()
            ->latest('id')
            ->paginate(15)
            ->through(function (Distributor $distributor) {
                return [
                    'id' => $distributor->id,
                    'name' => $distributor->name,
                    'legal_business_name' => $distributor->legal_business_name,
                    'gstin' => $distributor->gstin,
                    'email' => $distributor->email,
                    'phone' => $distributor->phone,
                    'application_status' => $distributor->application_status,
                    'created_at' => $distributor->created_at?->format('M d, Y'),
                    'approved_at' => $distributor->approved_at?->format('M d, Y'),
                    'rejected_at' => $distributor->rejected_at?->format('M d, Y'),
                    'rejection_note' => $distributor->rejection_note,
                ];
            });

        return $this->render('admin/resources/distributor/index', compact('data'));
    }

    public function show(Distributor $distributor)
    {
        $totalOutstandingBalance = (float) DistributorOrder::query()
            ->where('distributor_id', $distributor->id)
            ->sum(DB::raw('total_amount - amount_paid'));

        $data = [
            'id' => $distributor->id,
            'name' => $distributor->name,
            'legal_business_name' => $distributor->legal_business_name,
            'gstin' => $distributor->gstin,
            'email' => $distributor->email,
            'phone' => $distributor->phone,
            'application_status' => $distributor->application_status,
            'created_at' => $distributor->created_at?->format('M d, Y'),
            'approved_at' => $distributor->approved_at?->format('M d, Y'),
            'total_outstanding_balance' => $totalOutstandingBalance,
        ];

        return $this->render('admin/resources/distributor/show', compact('data'));
    }

    public function approve(Distributor $distributor): RedirectResponse
    {
        if ($distributor->application_status !== Distributor::STATUS_PENDING) {
            return redirect()->back()->with('warning', 'This application is not pending.');
        }

        $distributor->application_status = Distributor::STATUS_APPROVED;
        $distributor->approved_at = now();
        $distributor->approved_by = Auth::guard('admin')->id();
        $distributor->rejected_at = null;
        $distributor->rejection_note = null;
        $distributor->save();

        app(DefaultLocationService::class)->ensureDistributorDefaultRack($distributor);

        /** @var Admin $admin */
        $admin = Auth::guard('admin')->user();
        DistributorApplicationApproved::dispatch($distributor, $admin);

        return redirect()->back()->with('success', 'Distributor approved.');
    }

    public function reject(Request $request, Distributor $distributor): RedirectResponse
    {
        if ($distributor->application_status !== Distributor::STATUS_PENDING) {
            return redirect()->back()->with('warning', 'This application is not pending.');
        }

        $validated = $request->validate([
            'rejection_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $distributor->application_status = Distributor::STATUS_REJECTED;
        $distributor->rejected_at = now();
        $distributor->rejection_note = $validated['rejection_note'] ?? null;
        $distributor->approved_at = null;
        $distributor->approved_by = null;
        $distributor->save();

        DistributorApplicationRejected::dispatch(
            $distributor,
            $distributor->rejection_note,
        );

        return redirect()->back()->with('success', 'Distributor application rejected.');
    }
}
