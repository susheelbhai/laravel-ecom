<?php

namespace App\Notifications;

use App\Models\DealerOrder;
use App\Models\DealerOrderPayment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DealerOrderPaymentRecordedNotificationForDealer extends Notification
{
    use Queueable;

    public function __construct(
        public DealerOrder $order,
        public DealerOrderPayment $payment,
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
            ->subject('Payment received for order '.$this->order->order_number)
            ->markdown('mail.dealer-order.payment-recorded-for-dealer', [
                'order' => $this->order,
                'payment' => $this->payment,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'dealer_order_payment_recorded',
            'title' => 'Payment recorded on your order',
            'url' => route('dealer.orders.show', $this->order->id),
            'data' => [
                'order_id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'payment_id' => $this->payment->id,
                'amount' => (float) $this->payment->amount,
                'payment_status' => $this->order->payment_status,
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
