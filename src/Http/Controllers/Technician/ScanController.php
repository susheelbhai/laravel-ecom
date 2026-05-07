<?php

namespace App\Http\Controllers\Technician;

use App\Contracts\StolenSerialAlertServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\TechnicianScanRequest;
use App\Models\SerialNumber;
use App\Models\Technician;
use App\Models\TechnicianScan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ScanController extends Controller
{
    public function __construct(
        private StolenSerialAlertServiceInterface $stolenSerialAlertService,
    ) {}

    /**
     * Handle a technician serial number scan.
     *
     * Requirements: 8.1–8.6
     */
    public function scan(TechnicianScanRequest $request): JsonResponse
    {
        /** @var Technician $technician */
        $technician = Auth::guard('technician')->user();

        $serialNumber = SerialNumber::with('product')
            ->where('serial_number', $request->serial_number)
            ->first();

        if (! $serialNumber) {
            return response()->json([
                'message' => 'Serial number not found.',
            ], 404);
        }

        $scan = TechnicianScan::create([
            'technician_id' => $technician->id,
            'serial_number_id' => $serialNumber->id,
            'scanned_at' => now(),
            'location' => $request->location,
        ]);

        if ($serialNumber->isStolen()) {
            $this->stolenSerialAlertService->dispatch($serialNumber, $technician, $scan);

            return response()->json([
                'is_stolen' => true,
                'alert' => [
                    'serial_number' => $serialNumber->serial_number,
                    'product_name' => $serialNumber->product?->title,
                    'scanned_at' => $scan->scanned_at->toIso8601String(),
                ],
            ]);
        }

        return response()->json([
            'is_stolen' => false,
            'alert' => null,
        ]);
    }
}
