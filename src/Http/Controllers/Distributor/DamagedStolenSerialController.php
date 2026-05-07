<?php

namespace App\Http\Controllers\Distributor;

use App\Http\Controllers\Controller;
use App\Models\SerialNumber;
use App\Models\Warehouse;
use Illuminate\Support\Facades\Auth;

class DamagedStolenSerialController extends Controller
{
    /**
     * GET /distributor/serial-numbers/damaged
     */
    public function damaged()
    {
        $rackIds = $this->distributorRackIds();

        $serials = SerialNumber::where('status', 'damaged')
            ->whereIn('rack_id', $rackIds)
            ->with(['product:id,title,sku', 'movements' => fn ($q) => $q->orderBy('occurred_at', 'desc')->limit(1)])
            ->latest('updated_at')
            ->paginate(20);

        return $this->render('distributor/serial-numbers/damaged', [
            'serials' => $serials,
        ]);
    }

    /**
     * GET /distributor/serial-numbers/stolen
     */
    public function stolen()
    {
        $rackIds = $this->distributorRackIds();

        $serials = SerialNumber::where('status', 'stolen')
            ->whereIn('rack_id', $rackIds)
            ->with(['product:id,title,sku', 'movements' => fn ($q) => $q->orderBy('occurred_at', 'desc')->limit(1)])
            ->latest('updated_at')
            ->paginate(20);

        return $this->render('distributor/serial-numbers/stolen', [
            'serials' => $serials,
        ]);
    }

    private function distributorRackIds(): array
    {
        $distributorId = Auth::guard('distributor')->id();

        return Warehouse::where('owner_type', 'distributor')
            ->where('owner_id', $distributorId)
            ->with('racks:id,warehouse_id')
            ->get()
            ->flatMap(fn ($w) => $w->racks->pluck('id'))
            ->all();
    }
}
