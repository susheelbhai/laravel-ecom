<?php

namespace App\Notifications;

use App\Models\DistributorOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DistributorOrderCreatedByAdminNotificationForDistributor extends Notification
{
    use Queueable;

    public function __construct(
        public DistributorOrder $order,
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
            ->subject('New order placed for you — '.$this->order->order_number)
            ->markdown('mail.distributor-order.order-created-by-admin-for-distributor', [
                'order' => $this->order,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'distributor_order_created_by_admin',
            'title' => 'New order placed by admin',
            'url' => route('distributor.purchase-orders.show', $this->order->id),
            'data' => [
                'order_id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'total_amount' => $this->order->total_amount,
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
