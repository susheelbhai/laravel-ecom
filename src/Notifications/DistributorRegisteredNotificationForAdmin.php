<?php

namespace App\Notifications;

use App\Models\Distributor;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DistributorRegisteredNotificationForAdmin extends Notification
{
    use Queueable;

    public function __construct(
        public Distributor $distributor,
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
            ->subject('New distributor application — '.$this->distributor->legal_business_name)
            ->markdown('mail.distributor.registered-for-admin', [
                'distributor' => $this->distributor,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'distributor_registered',
            'title' => 'New distributor application',
            'url' => route('admin.distributor.index'),
            'data' => [
                'distributor_id' => $this->distributor->id,
                'name' => $this->distributor->name,
                'legal_business_name' => $this->distributor->legal_business_name,
                'email' => $this->distributor->email,
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
