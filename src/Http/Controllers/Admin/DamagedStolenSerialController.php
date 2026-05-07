<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SerialNumber;

class DamagedStolenSerialController extends Controller
{
    /**
     * GET /admin/serial-numbers/damaged
     */
    public function damaged()
    {
        $serials = SerialNumber::where('status', 'damaged')
            ->with(['product:id,title,sku', 'movements' => fn ($q) => $q->orderBy('occurred_at', 'desc')->limit(1)])
            ->latest('updated_at')
            ->paginate(20);

        return $this->render('admin/serial-numbers/damaged', [
            'serials' => $serials,
        ]);
    }

    /**
     * GET /admin/serial-numbers/stolen
     */
    public function stolen()
    {
        $serials = SerialNumber::where('status', 'stolen')
            ->with(['product:id,title,sku', 'movements' => fn ($q) => $q->orderBy('occurred_at', 'desc')->limit(1)])
            ->latest('updated_at')
            ->paginate(20);

        return $this->render('admin/serial-numbers/stolen', [
            'serials' => $serials,
        ]);
    }
}
