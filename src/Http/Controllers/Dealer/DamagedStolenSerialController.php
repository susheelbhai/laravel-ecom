<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\SerialNumber;
use App\Models\Warehouse;
use Illuminate\Support\Facades\Auth;

class DamagedStolenSerialController extends Controller
{
    /**
     * GET /dealer/serial-numbers/damaged
     */
    public function damaged()
    {
        $rackIds = $this->dealerRackIds();

        $serials = SerialNumber::where('status', 'damaged')
            ->whereIn('rack_id', $rackIds)
            ->with(['product:id,title,sku', 'movements' => fn ($q) => $q->orderBy('occurred_at', 'desc')->limit(1)])
            ->latest('updated_at')
            ->paginate(20);

        return $this->render('dealer/serial-numbers/damaged', [
            'serials' => $serials,
        ]);
    }

    /**
     * GET /dealer/serial-numbers/stolen
     */
    public function stolen()
    {
        $rackIds = $this->dealerRackIds();

        $serials = SerialNumber::where('status', 'stolen')
            ->whereIn('rack_id', $rackIds)
            ->with(['product:id,title,sku', 'movements' => fn ($q) => $q->orderBy('occurred_at', 'desc')->limit(1)])
            ->latest('updated_at')
            ->paginate(20);

        return $this->render('dealer/serial-numbers/stolen', [
            'serials' => $serials,
        ]);
    }

    private function dealerRackIds(): array
    {
        $dealerId = Auth::guard('dealer')->id();

        return Warehouse::where('owner_type', 'dealer')
            ->where('owner_id', $dealerId)
            ->with('racks:id,warehouse_id')
            ->get()
            ->flatMap(fn ($w) => $w->racks->pluck('id'))
            ->all();
    }
}
