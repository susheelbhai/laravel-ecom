<?php

namespace App\Listeners;

use App\Events\ProductEnquirySubmitted;
use App\Models\Admin;
use App\Notifications\ProductEnquirySubmittedNotificationForAdmin;
use App\Notifications\ProductEnquirySubmittedNotificationForUser;

class SendProductEnquirySubmittedNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    public function handle(ProductEnquirySubmitted $enquiry): void
    {
        $admin = Admin::first();
        $admin->notify(new ProductEnquirySubmittedNotificationForAdmin($enquiry));
        $enquiry->data->notify(new ProductEnquirySubmittedNotificationForUser($enquiry));
    }
}
