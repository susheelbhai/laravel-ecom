<?php

namespace App\Http\Controllers\Admin;

use App\Actions\SerialNumberAuthorization;
use App\Contracts\SerialNumberMovementServiceInterface;
use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\MarkDamagedRequest;
use App\Http\Requests\MarkStolenRequest;
use App\Models\SerialNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class SerialNumberController extends Controller
{
    public function __construct(
        private readonly SerialNumberMovementServiceInterface $serialNumberMovementService,
        private readonly SerialNumberAuthorization $authorization,
    ) {}

    /**
     * GET /admin/serial-numbers/lookup?q=SN-0001
     */
    public function lookup(Request $request)
    {
        $query = trim((string) $request->q);

        if ($query === '') {
            return $this->render('admin/serial-numbers/lookup', [
                'serialNumber' => null,
                'movements' => [],
            ]);
        }

        $serialNumber = SerialNumber::where('serial_number', $query)
            ->with(['product:id,title,sku'])
            ->first();

        if (! $serialNumber) {
            return $this->render('admin/serial-numbers/lookup', [
                'serialNumber' => null,
                'movements' => [],
            ]);
        }

        $movements = $serialNumber->movements()->orderBy('occurred_at', 'asc')->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'event_type' => $m->event_type,
                'from_party' => $m->from_party,
                'to_party' => $m->to_party,
                'occurred_at' => Helper::customDateTime($m->occurred_at),
                'actor_label' => $m->actor_label ?? null,
                'notes' => $m->notes,
            ]);

        $currentLocation = $this->authorization->currentLocation($serialNumber) ?? 'Admin Warehouse';
        $isAtAdmin = str_contains(strtolower($currentLocation), 'admin');

        // Only load rack details when the unit is still in an admin warehouse.
        $rack = null;
        if ($isAtAdmin) {
            $serialNumber->load('rack:id,identifier,warehouse_id', 'rack.warehouse:id,name');
            $rack = $serialNumber->rack ? [
                'id' => $serialNumber->rack->id,
                'identifier' => $serialNumber->rack->identifier,
                'warehouse' => $serialNumber->rack->warehouse
                    ? ['id' => $serialNumber->rack->warehouse->id, 'name' => $serialNumber->rack->warehouse->name]
                    : null,
            ] : null;
        }

        return $this->render('admin/serial-numbers/lookup', [
            'serialNumber' => [
                'id' => $serialNumber->id,
                'serial_number' => $serialNumber->serial_number,
                'status' => $serialNumber->status,
                'current_location' => $currentLocation,
                'product' => $serialNumber->product ? [
                    'id' => $serialNumber->product->id,
                    'title' => $serialNumber->product->title,
                    'sku' => $serialNumber->product->sku,
                ] : null,
                'rack' => $rack,
                'can_mark_stolen' => $this->authorization->canMarkStolen($serialNumber, 'admin'),
                'can_mark_damaged' => $this->authorization->canMarkDamaged($serialNumber, 'admin'),
            ],
            'movements' => $movements,
        ]);
    }

    /**
     * GET /admin/serial-numbers/{serialNumber}
     */
    public function show(SerialNumber $serialNumber)
    {
        $serialNumber->load(['product:id,title,sku', 'movements']);
        $currentLocation = $this->authorization->currentLocation($serialNumber) ?? 'Admin Warehouse';
        $isAtAdmin = str_contains(strtolower($currentLocation), 'admin');

        if ($isAtAdmin) {
            $serialNumber->load('rack:id,identifier,warehouse_id', 'rack.warehouse:id,name');
        }

        return $this->render('admin/serial-numbers/show', [
            'serialNumber' => $serialNumber,
            'movements' => $serialNumber->movements->sortBy('occurred_at')->values(),
            'current_location' => $currentLocation,
            'can_mark_stolen' => $this->authorization->canMarkStolen($serialNumber, 'admin'),
            'can_mark_damaged' => $this->authorization->canMarkDamaged($serialNumber, 'admin'),
        ]);
    }

    /**
     * POST /admin/serial-numbers/{serialNumber}/mark-stolen
     */
    public function markStolen(MarkStolenRequest $request, SerialNumber $serialNumber): RedirectResponse
    {
        $this->authorization->authorizeMarkStolen($serialNumber, 'admin');

        $this->serialNumberMovementService->markStolen(
            serialNumber: $serialNumber,
            actor: Auth::guard('admin')->user(),
            notes: $request->input('notes'),
        );

        return redirect()->back()->with('success', 'Serial number marked as stolen.');
    }

    /**
     * POST /admin/serial-numbers/{serialNumber}/mark-damaged
     */
    public function markDamaged(MarkDamagedRequest $request, SerialNumber $serialNumber): RedirectResponse
    {
        $this->authorization->authorizeMarkDamaged($serialNumber, 'admin');

        try {
            $this->serialNumberMovementService->markDamaged(
                serialNumber: $serialNumber,
                actor: Auth::guard('admin')->user(),
                notes: $request->input('notes'),
            );
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        return redirect()->back()->with('success', 'Serial number marked as damaged.');
    }
}
