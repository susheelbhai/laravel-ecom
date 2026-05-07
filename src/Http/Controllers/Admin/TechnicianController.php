<?php

namespace App\Http\Controllers\Admin;

use App\Events\TechnicianApplicationApproved;
use App\Events\TechnicianApplicationRejected;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Technician;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TechnicianController extends Controller
{
    public function index()
    {
        $data = Technician::query()
            ->latest('id')
            ->paginate(15)
            ->through(function (Technician $technician) {
                return [
                    'id' => $technician->id,
                    'name' => $technician->name,
                    'email' => $technician->email,
                    'phone' => $technician->phone,
                    'specialization' => $technician->specialization,
                    'experience_years' => $technician->experience_years,
                    'city' => $technician->city,
                    'state' => $technician->state,
                    'application_status' => $technician->application_status,
                    'created_at' => $technician->created_at?->format('M d, Y'),
                    'approved_at' => $technician->approved_at?->format('M d, Y'),
                    'rejected_at' => $technician->rejected_at?->format('M d, Y'),
                    'rejection_note' => $technician->rejection_note,
                ];
            });

        return $this->render('admin/resources/technician/index', compact('data'));
    }

    public function approve(Technician $technician): RedirectResponse
    {
        if ($technician->application_status !== Technician::STATUS_PENDING) {
            return redirect()->back()->with('warning', 'This application is not pending.');
        }

        $technician->application_status = Technician::STATUS_APPROVED;
        $technician->approved_at = now();
        $technician->approved_by = Auth::guard('admin')->id();
        $technician->rejected_at = null;
        $technician->rejection_note = null;
        $technician->save();

        /** @var Admin $admin */
        $admin = Auth::guard('admin')->user();
        TechnicianApplicationApproved::dispatch($technician, $admin);

        return redirect()->back()->with('success', 'Technician approved.');
    }

    public function reject(Request $request, Technician $technician): RedirectResponse
    {
        if ($technician->application_status !== Technician::STATUS_PENDING) {
            return redirect()->back()->with('warning', 'This application is not pending.');
        }

        $validated = $request->validate([
            'rejection_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $technician->application_status = Technician::STATUS_REJECTED;
        $technician->rejected_at = now();
        $technician->rejection_note = $validated['rejection_note'] ?? null;
        $technician->approved_at = null;
        $technician->approved_by = null;
        $technician->save();

        TechnicianApplicationRejected::dispatch(
            $technician,
            $technician->rejection_note,
        );

        return redirect()->back()->with('success', 'Technician application rejected.');
    }
}
