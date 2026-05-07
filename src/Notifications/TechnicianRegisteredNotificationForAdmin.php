<?php

namespace App\Notifications;

use App\Models\Technician;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TechnicianRegisteredNotificationForAdmin extends Notification
{
    use Queueable;

    public function __construct(
        public Technician $technician,
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
        return (new MailMessage)
            ->subject('New technician application — '.$this->technician->name)
            ->line('A new technician has submitted a registration application.')
            ->line('Name: '.$this->technician->name)
            ->line('Email: '.$this->technician->email)
            ->line('Specialization: '.($this->technician->specialization ?? 'N/A'))
            ->action('Review Application', route('admin.dashboard'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'technician_registered',
            'title' => 'New technician application',
            'url' => route('admin.dashboard'),
            'data' => [
                'technician_id' => $this->technician->id,
                'name' => $this->technician->name,
                'email' => $this->technician->email,
                'specialization' => $this->technician->specialization,
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
