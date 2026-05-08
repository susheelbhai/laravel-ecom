<?php

namespace App\Notifications;

use App\Models\SerialNumber;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SerialMarkedDamagedNotificationForAdmin extends Notification
{
    use Queueable;

    public function __construct(
        public SerialNumber $serialNumber,
        public object $actor,
    ) {}

    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast'];
        if (config('mail.send_mail') == 1 && isset($notifiable->email)) {
            $channels[] = 'mail';
        }
        if (config('whatsapp.send_msg') == 1 && isset($notifiable->phone)) {
            $channels[] = 'whatsapp';
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Serial number marked as damaged — '.$this->serialNumber->serial_number)
            ->markdown('mail.serial-number.marked-damaged-for-admin', [
                'serialNumber' => $this->serialNumber,
                'actor' => $this->actor,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'serial_marked_damaged',
            'title' => 'Serial number marked as damaged',
            'url' => route('admin.serial-numbers.show', $this->serialNumber->id),
            'data' => [
                'serial_number_id' => $this->serialNumber->id,
                'serial_number' => $this->serialNumber->serial_number,
                'product_name' => $this->serialNumber->product?->title,
                'actor_name' => $this->actor->name ?? null,
            ],
        ];
    }

    public function toDatabase(object $notifiable): array
    {
        return $this->toArray($notifiable);
    }

    public function toBroadcast(object $notifiable): array
    {
        return [
            'data' => $this->toArray($notifiable),
        ];
    }
}
