<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPlacedNotificationForUser extends Notification
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
     *
     * @return array<int, string>
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

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Confirmation - #'.$this->order->order_number)
            ->markdown('mail.order.order-placed-for-user', [
                'order' => $this->order,
            ]);
    }

    public function toWhatsAppText(object $notifiable)
    {
        return [
            'message' => 'Thank you for your order! Your order #'.$this->order->order_number.' has been placed successfully. Total: '.number_format($this->order->total_amount, 2),
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
