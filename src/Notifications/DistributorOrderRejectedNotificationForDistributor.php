<?php

namespace App\Notifications;

use App\Models\DistributorOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DistributorOrderRejectedNotificationForDistributor extends Notification
{
    use Queueable;

    public function __construct(
        public DistributorOrder $order,
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
            ->subject('Update on your purchase order — '.$this->order->order_number)
            ->markdown('mail.distributor-order.order-rejected-for-distributor', [
                'order' => $this->order,
                'rejectionNote' => $this->rejectionNote,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'distributor_order_rejected',
            'title' => 'Purchase order not approved',
            'url' => route('distributor.purchase-orders.show', $this->order->id),
            'data' => [
                'order_id' => $this->order->id,
                'order_number' => $this->order->order_number,
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
