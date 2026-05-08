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
        $distributor->loadMissing(['state', 'approvedByAdmin']);

        $totalOutstandingBalance = (float) DistributorOrder::query()
            ->where('distributor_id', $distributor->id)
            ->where('status', DistributorOrder::STATUS_APPROVED)
            ->sum(DB::raw('total_amount - amount_paid'));

        $data = [
            'id' => $distributor->id,

            // Identity & contact
            'name' => $distributor->name,
            'email' => $distributor->email,
            'phone' => $distributor->phone,
            'dob' => $distributor->dob,
            'avatar' => $distributor->profile_pic,

            // Business
            'legal_business_name' => $distributor->legal_business_name,
            'trade_name' => $distributor->trade_name,
            'business_constitution' => $distributor->business_constitution,
            'authorized_signatory_designation' => $distributor->authorized_signatory_designation,
            'nature_of_business' => $distributor->nature_of_business,
            'years_in_business' => $distributor->years_in_business,
            'expected_monthly_purchase_band' => $distributor->expected_monthly_purchase_band,
            'referral_source' => $distributor->referral_source,

            // Address
            'address' => $distributor->address,
            'city' => $distributor->city,
            'state' => $distributor->state?->name,
            'pincode' => $distributor->pincode,
            'warehouse_address' => $distributor->warehouse_address,

            // KYC
            'kyc_id_type' => $distributor->kyc_id_type,
            'kyc_id_number' => $distributor->kyc_id_number,

            // Tax
            'pan_number' => $distributor->pan_number,
            'gstin' => $distributor->gstin,
            'tan_number' => $distributor->tan_number,
            'msme_udyam_number' => $distributor->msme_udyam_number,

            // Bank
            'bank_account_holder_name' => $distributor->bank_account_holder_name,
            'bank_name' => $distributor->bank_name,
            'bank_branch' => $distributor->bank_branch,
            'bank_account_number' => $distributor->bank_account_number,
            'bank_ifsc' => $distributor->bank_ifsc,

            // Application
            'application_status' => $distributor->application_status,
            'commission_percentage' => $distributor->commission_percentage,
            'created_at' => $distributor->created_at?->format('d M Y'),
            'approved_at' => $distributor->approved_at?->format('d M Y'),
            'approved_by_name' => $distributor->approvedByAdmin?->name,
            'rejected_at' => $distributor->rejected_at?->format('d M Y'),
            'rejection_note' => $distributor->rejection_note,

            // Finance
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
