<?php

namespace App\Services;

use App\Contracts\StolenSerialAlertServiceInterface;
use App\Models\Admin;
use App\Models\SerialNumber;
use App\Models\Technician;
use App\Models\TechnicianScan;
use App\Notifications\StolenSerialAlertNotification;
use Illuminate\Database\Eloquent\Model;

class StolenSerialAlertService implements StolenSerialAlertServiceInterface
{
    /**
     * Dispatch stolen serial alerts to all relevant parties.
     */
    public function dispatch(
        SerialNumber $serialNumber,
        Technician $technician,
        TechnicianScan $scan
    ): void {
        $recipients = $this->resolveRecipients($serialNumber);
        $notification = new StolenSerialAlertNotification($serialNumber, $technician, $scan);

        foreach ($recipients as $recipient) {
            $recipient->notify($notification);
        }
    }

    /**
     * Resolve the ordered list of parties to notify, from current owner upward.
     *
     * @return Model[]
     */
    public function resolveRecipients(SerialNumber $serialNumber): array
    {
        $movements = $serialNumber->movements()
            ->orderBy('occurred_at', 'asc')
            ->get();

        $recipients = [];
        $seen = [];

        foreach ($movements as $movement) {
            if ($movement->actor_type && $movement->actor_id) {
                $key = $movement->actor_type.':'.$movement->actor_id;
                if (! isset($seen[$key])) {
                    $actor = $movement->actor;
                    if ($actor) {
                        $recipients[] = $actor;
                        $seen[$key] = true;
                    }
                }
            }
        }

        // Always include Admin
        $admin = Admin::first();
        if ($admin) {
            $key = Admin::class.':'.$admin->id;
            if (! isset($seen[$key])) {
                $recipients[] = $admin;
            }
        }

        return $recipients;
    }
}
