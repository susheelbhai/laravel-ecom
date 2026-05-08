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
            ->with('state:id,name')
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
                    'state' => $technician->state?->name,
                    'application_status' => $technician->application_status,
                    'created_at' => $technician->created_at?->format('M d, Y'),
                    'approved_at' => $technician->approved_at?->format('M d, Y'),
                    'rejected_at' => $technician->rejected_at?->format('M d, Y'),
                    'rejection_note' => $technician->rejection_note,
                ];
            });

        return $this->render('admin/resources/technician/index', compact('data'));
    }

    public function show(Technician $technician)
    {
        $technician->loadMissing(['state', 'approvedByAdmin']);

        $specializationLabels = [
            'ac_refrigeration' => 'AC & Refrigeration',
            'electrical' => 'Electrical',
            'plumbing' => 'Plumbing',
            'carpentry' => 'Carpentry',
            'painting' => 'Painting',
            'welding' => 'Welding',
            'solar_installation' => 'Solar Installation',
            'cctv_security' => 'CCTV & Security Systems',
            'it_networking' => 'IT & Networking',
            'other' => 'Other',
        ];

        $idTypeLabels = [
            'aadhaar' => 'Aadhaar',
            'passport' => 'Passport',
            'voter_id' => 'Voter ID',
            'drivers_license' => "Driver's License",
            'national_id' => 'National ID',
            'other' => 'Other',
        ];

        $data = [
            'id' => $technician->id,
            'name' => $technician->name,
            'email' => $technician->email,
            'phone' => $technician->phone,
            'avatar' => $technician->profile_pic,
            'specialization' => $specializationLabels[$technician->specialization] ?? $technician->specialization,
            'experience_years' => $technician->experience_years,
            'certification' => $technician->certification,
            'referral_source' => $technician->referral_source,
            'address' => $technician->address,
            'city' => $technician->city,
            'state' => $technician->state?->name,
            'pincode' => $technician->pincode,
            'id_type' => $idTypeLabels[$technician->id_type] ?? $technician->id_type,
            'id_number' => $technician->id_number,
            'application_status' => $technician->application_status,
            'created_at' => $technician->created_at?->format('d M Y'),
            'approved_at' => $technician->approved_at?->format('d M Y'),
            'approved_by_name' => $technician->approvedByAdmin?->name,
            'rejected_at' => $technician->rejected_at?->format('d M Y'),
            'rejection_note' => $technician->rejection_note,
        ];

        return $this->render('admin/resources/technician/show', compact('data'));
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
