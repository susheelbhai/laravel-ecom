<?php

namespace App\Notifications;

use App\Models\Admin;
use App\Models\Technician;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TechnicianApplicationApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Technician $technician,
        public Admin $approvedBy,
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
            ->subject('Your technician application has been approved')
            ->line('Congratulations! Your technician application has been approved.')
            ->line('You can now sign in to your dashboard.')
            ->action('Sign In', route('technician.login'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'technician_application_approved',
            'title' => 'Application approved',
            'url' => route('technician.dashboard'),
            'data' => [
                'technician_id' => $this->technician->id,
                'approved_by' => $this->approvedBy->name,
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
