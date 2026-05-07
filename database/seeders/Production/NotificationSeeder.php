<?php

namespace Database\Seeders\Production;

use Illuminate\Database\Seeder;
use Illuminate\Notifications\DatabaseNotification;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        DatabaseNotification::insert($notifications);
    }
}
