<?php

namespace App\Notifications;

use App\Models\Admin;
use App\Models\Dealer;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DealerApplicationApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Dealer $dealer,
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
            ->subject('Your dealer account was approved')
            ->markdown('mail.dealer.application-approved', [
                'dealer' => $this->dealer,
                'approvedBy' => $this->approvedBy,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'dealer_application_approved',
            'title' => 'Dealer account approved',
            'url' => route('dealer.dashboard'),
            'data' => [
                'dealer_id' => $this->dealer->id,
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
