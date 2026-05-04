<?php

namespace App\Notifications;

use App\Models\Admin;
use App\Models\Distributor;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DistributorApplicationApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Distributor $distributor,
        public Admin $approvedBy,
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
            ->subject('Your distributor application was approved')
            ->markdown('mail.distributor.application-approved', [
                'distributor' => $this->distributor,
                'approvedBy' => $this->approvedBy,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'distributor_application_approved',
            'title' => 'Distributor application approved',
            'url' => route('distributor.dashboard'),
            'data' => [
                'distributor_id' => $this->distributor->id,
                'approved_by_admin_id' => $this->approvedBy->id,
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
