<?php

namespace App\Contracts;

use App\Models\SerialNumber;
use App\Models\Technician;
use App\Models\TechnicianScan;
use Illuminate\Database\Eloquent\Model;

interface StolenSerialAlertServiceInterface
{
    /**
     * Dispatch stolen serial alerts to all relevant parties.
     * Recipients = current owner (latest to_party) + all higher-level parties in the chain.
     */
    public function dispatch(
        SerialNumber $serialNumber,
        Technician $technician,
        TechnicianScan $scan
    ): void;

    /**
     * Resolve the ordered list of parties to notify, from current owner upward.
     * e.g. if at Customer → [Customer, Dealer, Distributor, Admin]
     *
     * @return Model[]
     */
    public function resolveRecipients(SerialNumber $serialNumber): array;
}
