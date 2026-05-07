<?php

namespace App\Notifications;

use App\Models\SerialNumber;
use App\Models\Technician;
use App\Models\TechnicianScan;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class StolenSerialAlertNotification extends Notification
{
    use Queueable;

    public function __construct(
        public SerialNumber $serialNumber,
        public Technician $technician,
        public TechnicianScan $scan,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'serial_number' => $this->serialNumber->serial_number,
            'product_name' => $this->serialNumber->product?->title,
            'technician_name' => $this->technician->name,
            'technician_id' => $this->technician->id,
            'scanned_at' => $this->scan->scanned_at?->toIso8601String(),
            'scan_location' => $this->scan->location,
        ];
    }

    public function toDatabase(object $notifiable): array
    {
        return $this->toArray($notifiable);
    }
}
