<?php

namespace App\Notifications;

use App\Models\Technician;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TechnicianApplicationRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Technician $technician,
        public ?string $rejectionNote,
    ) {}

    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast'];
        if (config('mail.send_mail') == 1 && isset($notifiable->email)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject('Your technician application was not approved')
            ->line('Unfortunately, your technician application was not approved at this time.');

        if ($this->rejectionNote) {
            $mail->line('Reason: '.$this->rejectionNote);
        }

        return $mail->line('Please contact support if you have any questions.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'technician_application_rejected',
            'title' => 'Application not approved',
            'url' => route('technician.login'),
            'data' => [
                'technician_id' => $this->technician->id,
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
        return ['data' => $this->toArray($notifiable)];
    }
}
