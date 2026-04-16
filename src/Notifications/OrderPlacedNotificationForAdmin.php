<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPlacedNotificationForAdmin extends Notification implements ShouldQueue
{
    use Queueable;

    private Order $order;

    /**
     * Create a new notification instance.
     */
    public function __construct($event)
    {
        $this->order = $event->order;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        $channels = [];
        if (config('mail.send_mail') == 1 && isset($notifiable->email)) {
            $channels[] = 'mail';
        }
        if (config('whatsapp.send_msg') == 1 && isset($notifiable->phone)) {
            $channels[] = 'whatsapp';
        }
        // Always add database and broadcast (push) channels
        $channels[] = 'database';
        $channels[] = 'broadcast';

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Order Placed - #'.$this->order->order_number)
            ->markdown('mail.order.order-placed-for-admin', [
                'order' => $this->order,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'order_placed',
            'title' => 'New Order Placed',
            'url' => route('admin.order.show', $this->order->id),
            'data' => [
                'order_id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'total_amount' => $this->order->total_amount,
            ],
        ];
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return $this->toArray($notifiable);
    }

    /**
     * Get the broadcast (push) representation of the notification.
     */
    public function toBroadcast(object $notifiable)
    {
        return [
            'data' => $this->toArray($notifiable),
        ];
    }
}
