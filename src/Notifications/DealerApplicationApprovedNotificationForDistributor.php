<?php

namespace App\Notifications;

use App\Models\Dealer;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DealerApplicationApprovedNotificationForDistributor extends Notification
{
    use Queueable;

    public function __construct(
        public Dealer $dealer,
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
            ->subject('Dealer approved: '.$this->dealer->name)
            ->markdown('mail.dealer.application-approved-for-distributor', [
                'dealer' => $this->dealer,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'dealer_application_approved_distributor',
            'title' => 'Dealer account approved',
            'url' => route('distributor.dealer.index'),
            'data' => [
                'dealer_id' => $this->dealer->id,
                'name' => $this->dealer->name,
                'email' => $this->dealer->email,
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
