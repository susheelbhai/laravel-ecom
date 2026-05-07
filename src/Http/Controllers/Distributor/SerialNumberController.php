<?php

namespace App\Http\Controllers\Distributor;

use App\Actions\SerialNumberAuthorization;
use App\Contracts\SerialNumberMovementServiceInterface;
use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\MarkDamagedRequest;
use App\Http\Requests\MarkStolenRequest;
use App\Models\DistributorOrderItem;
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
     * GET /distributor/serial-numbers/lookup?q=SN-0001
     */
    public function lookup(Request $request)
    {
        $query = trim((string) $request->q);

        if ($query === '') {
            return $this->render('distributor/serial-numbers/lookup', [
                'serialNumber' => null,
                'movements' => [],
            ]);
        }

        $distributorId = Auth::guard('distributor')->id();

        // Find the serial by string — then verify this distributor ever handled it
        // by checking for a distributor_order movement linked to their orders.
        $serialNumber = SerialNumber::where('serial_number', $query)
            ->with(['product:id,title,sku'])
            ->whereHas('movements', fn ($q) => $q->where('event_type', 'distributor_order')
                ->whereHasMorph('reference', [DistributorOrderItem::class],
                    fn ($q) => $q->whereHas('order', fn ($q) => $q->where('distributor_id', $distributorId))
                )
            )
            ->first();

        if (! $serialNumber) {
            return $this->render('distributor/serial-numbers/lookup', [
                'serialNumber' => null,
                'movements' => [],
            ]);
        }

        $allMovements = $serialNumber->movements()->orderBy('occurred_at', 'asc')->get();
        $currentLocation = $this->authorization->currentLocation($serialNumber) ?? 'Distributor';

        // Only show movements from the point the serial arrived at distributor level.
        // Find the first distributor_order movement and show from there onwards.
        $firstDistributorIdx = $allMovements->search(fn ($m) => $m->event_type === 'distributor_order');
        $visibleMovements = ($firstDistributorIdx !== false
            ? $allMovements->slice($firstDistributorIdx)->values()
            : $allMovements
        )->map(fn ($m) => [
            'id' => $m->id,
            'event_type' => $m->event_type,
            'from_party' => $m->from_party,
            'to_party' => $m->to_party,
            'occurred_at' => Helper::customDateTime($m->occurred_at),
            'notes' => $m->notes,
        ]);

        return $this->render('distributor/serial-numbers/lookup', [
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
                'can_mark_stolen' => $this->authorization->canMarkStolen($serialNumber, 'distributor'),
                'can_mark_damaged' => $this->authorization->canMarkDamaged($serialNumber, 'distributor'),
            ],
            'movements' => $visibleMovements,
        ]);
    }

    /** POST /distributor/serial-numbers/{serialNumber}/mark-stolen */
    public function markStolen(MarkStolenRequest $request, SerialNumber $serialNumber): RedirectResponse
    {
        $this->authorization->authorizeMarkStolen($serialNumber, 'distributor');

        $this->serialNumberMovementService->markStolen(
            serialNumber: $serialNumber,
            actor: Auth::guard('distributor')->user(),
            notes: $request->input('notes'),
        );

        return redirect()->back()->with('success', 'Serial number marked as stolen.');
    }

    /** POST /distributor/serial-numbers/{serialNumber}/mark-damaged */
    public function markDamaged(MarkDamagedRequest $request, SerialNumber $serialNumber): RedirectResponse
    {
        $this->authorization->authorizeMarkDamaged($serialNumber, 'distributor');

        try {
            $this->serialNumberMovementService->markDamaged(
                serialNumber: $serialNumber,
                actor: Auth::guard('distributor')->user(),
                notes: $request->input('notes'),
            );
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        return redirect()->back()->with('success', 'Serial number marked as damaged.');
    }
}
