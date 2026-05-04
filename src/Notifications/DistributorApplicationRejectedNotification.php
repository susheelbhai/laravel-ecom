<?php

namespace App\Notifications;

use App\Models\Distributor;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DistributorApplicationRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Distributor $distributor,
        public ?string $rejectionNote,
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
            ->subject('Update on your distributor application')
            ->markdown('mail.distributor.application-rejected', [
                'distributor' => $this->distributor,
                'rejectionNote' => $this->rejectionNote,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'distributor_application_rejected',
            'title' => 'Distributor application not approved',
            'url' => route('distributor.login'),
            'data' => [
                'distributor_id' => $this->distributor->id,
                'rejection_note' => $this->rejectionNote,
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
