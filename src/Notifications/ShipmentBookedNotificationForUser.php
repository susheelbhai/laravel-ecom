<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ShipmentBookedNotificationForUser extends Notification
{
    use Queueable;

    public function __construct(
        public Order $order,
        public string $trackingNumber,
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
            ->subject('Your order has been shipped — '.$this->order->order_number)
            ->markdown('mail.order.shipment-booked-for-user', [
                'order' => $this->order,
                'trackingNumber' => $this->trackingNumber,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'shipment_booked',
            'title' => 'Your order has been shipped',
            'url' => route('orders.show', $this->order->id),
            'data' => [
                'order_id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'tracking_number' => $this->trackingNumber,
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
