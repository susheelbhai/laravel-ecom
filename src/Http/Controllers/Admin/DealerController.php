<?php

namespace App\Http\Controllers\Admin;

use App\Events\DealerApplicationApproved;
use App\Events\DealerApplicationRejected;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Dealer;
use App\Services\Inventory\DefaultLocationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DealerController extends Controller
{
    public function index()
    {
        $data = Dealer::query()
            ->with('distributor:id,name,email')
            ->latest('id')
            ->paginate(15)
            ->through(function (Dealer $dealer) {
                return [
                    'id' => $dealer->id,
                    'name' => $dealer->name,
                    'email' => $dealer->email,
                    'phone' => $dealer->phone,
                    'distributor_name' => $dealer->distributor?->name,
                    'distributor_email' => $dealer->distributor?->email,
                    'application_status' => $dealer->application_status,
                    'created_at' => $dealer->created_at?->format('M d, Y'),
                    'approved_at' => $dealer->approved_at?->format('M d, Y'),
                    'rejected_at' => $dealer->rejected_at?->format('M d, Y'),
                    'rejection_note' => $dealer->rejection_note,
                ];
            });

        return $this->render('admin/resources/dealer/index', compact('data'));
    }

    public function show(Dealer $dealer)
    {
        $dealer->loadMissing(['distributor:id,name,email', 'approvedByAdmin:id,name']);

        $data = [
            'id' => $dealer->id,
            'name' => $dealer->name,
            'email' => $dealer->email,
            'phone' => $dealer->phone,
            'avatar' => $dealer->profile_pic,
            'application_status' => $dealer->application_status,
            'commission_percentage' => $dealer->commission_percentage,
            'distributor_id' => $dealer->distributor_id,
            'distributor_name' => $dealer->distributor?->name,
            'distributor_email' => $dealer->distributor?->email,
            'approved_at' => $dealer->approved_at?->format('d M Y'),
            'approved_by_name' => $dealer->approvedByAdmin?->name,
            'rejected_at' => $dealer->rejected_at?->format('d M Y'),
            'rejection_note' => $dealer->rejection_note,
            'created_at' => $dealer->created_at?->format('d M Y'),
        ];

        return $this->render('admin/resources/dealer/show', compact('data'));
    }

    public function approve(Dealer $dealer): RedirectResponse
    {
        if ($dealer->application_status !== Dealer::STATUS_PENDING) {
            return redirect()->back()->with('warning', 'This application is not pending.');
        }

        $dealer->application_status = Dealer::STATUS_APPROVED;
        $dealer->approved_at = now();
        $dealer->approved_by = Auth::guard('admin')->id();
        $dealer->rejected_at = null;
        $dealer->rejection_note = null;
        $dealer->save();

        app(DefaultLocationService::class)->ensureDealerDefaultRack($dealer);

        /** @var Admin $admin */
        $admin = Auth::guard('admin')->user();
        DealerApplicationApproved::dispatch($dealer, $admin);

        return redirect()->back()->with('success', 'Dealer approved.');
    }

    public function reject(Request $request, Dealer $dealer): RedirectResponse
    {
        if ($dealer->application_status !== Dealer::STATUS_PENDING) {
            return redirect()->back()->with('warning', 'This application is not pending.');
        }

        $validated = $request->validate([
            'rejection_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $dealer->application_status = Dealer::STATUS_REJECTED;
        $dealer->rejected_at = now();
        $dealer->rejection_note = $validated['rejection_note'] ?? null;
        $dealer->approved_at = null;
        $dealer->approved_by = null;
        $dealer->save();

        DealerApplicationRejected::dispatch(
            $dealer,
            $dealer->rejection_note,
        );

        return redirect()->back()->with('success', 'Dealer application rejected.');
    }
}
