<?php

namespace App\Listeners;

use App\Events\ContactFormSubmitted;
use App\Models\Admin;
use App\Notifications\ContactFormSubmittedNotificationForAdmin;
use App\Notifications\ContactFormSubmittedNotificationForUser;

class SendContactFormSubmittedNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    public function handle(ContactFormSubmitted $user): void
    {
        $admin = Admin::first();
        $admin->notify(new ContactFormSubmittedNotificationForAdmin($user));
        $user->data->notify(new ContactFormSubmittedNotificationForUser($user));
    }
}
