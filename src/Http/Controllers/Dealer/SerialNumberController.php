<?php

namespace App\Http\Controllers\Dealer;

use App\Actions\SerialNumberAuthorization;
use App\Contracts\SerialNumberMovementServiceInterface;
use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\MarkDamagedRequest;
use App\Http\Requests\MarkStolenRequest;
use App\Models\DealerOrderItem;
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
     * GET /dealer/serial-numbers/lookup?q=SN-0001
     */
    public function lookup(Request $request)
    {
        $query = trim((string) $request->q);

        if ($query === '') {
            return $this->render('dealer/serial-numbers/lookup', [
                'serialNumber' => null,
                'movements' => [],
            ]);
        }

        $dealerId = Auth::guard('dealer')->id();

        // Find the serial by string — verify this dealer ever received it
        // by checking for a dealer_order movement linked to their orders.
        $serialNumber = SerialNumber::where('serial_number', $query)
            ->with(['product:id,title,sku'])
            ->whereHas('movements', fn ($q) => $q->where('event_type', 'dealer_order')
                ->whereHasMorph('reference', [DealerOrderItem::class],
                    fn ($q) => $q->whereHas('order', fn ($q) => $q->where('dealer_id', $dealerId))
                )
            )
            ->first();

        if (! $serialNumber) {
            return $this->render('dealer/serial-numbers/lookup', [
                'serialNumber' => null,
                'movements' => [],
            ]);
        }

        $allMovements = $serialNumber->movements()->orderBy('occurred_at', 'asc')->get();
        $currentLocation = $this->authorization->currentLocation($serialNumber) ?? 'Dealer';

        // Only show movements from the point the serial arrived at dealer level.
        $firstDealerIdx = $allMovements->search(fn ($m) => $m->event_type === 'dealer_order');
        $visibleMovements = ($firstDealerIdx !== false
            ? $allMovements->slice($firstDealerIdx)->values()
            : $allMovements
        )->map(fn ($m) => [
            'id' => $m->id,
            'event_type' => $m->event_type,
            'from_party' => $m->from_party,
            'to_party' => $m->to_party,
            'occurred_at' => Helper::customDateTime($m->occurred_at),
            'notes' => $m->notes,
        ]);

        return $this->render('dealer/serial-numbers/lookup', [
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
                'can_mark_stolen' => $this->authorization->canMarkStolen($serialNumber, 'dealer'),
                'can_mark_damaged' => $this->authorization->canMarkDamaged($serialNumber, 'dealer'),
            ],
            'movements' => $visibleMovements,
        ]);
    }

    /** POST /dealer/serial-numbers/{serialNumber}/mark-stolen */
    public function markStolen(MarkStolenRequest $request, SerialNumber $serialNumber): RedirectResponse
    {
        $this->authorization->authorizeMarkStolen($serialNumber, 'dealer');

        $this->serialNumberMovementService->markStolen(
            serialNumber: $serialNumber,
            actor: Auth::guard('dealer')->user(),
            notes: $request->input('notes'),
        );

        return redirect()->back()->with('success', 'Serial number marked as stolen.');
    }

    /** POST /dealer/serial-numbers/{serialNumber}/mark-damaged */
    public function markDamaged(MarkDamagedRequest $request, SerialNumber $serialNumber): RedirectResponse
    {
        $this->authorization->authorizeMarkDamaged($serialNumber, 'dealer');

        try {
            $this->serialNumberMovementService->markDamaged(
                serialNumber: $serialNumber,
                actor: Auth::guard('dealer')->user(),
                notes: $request->input('notes'),
            );
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        return redirect()->back()->with('success', 'Serial number marked as damaged.');
    }
}
