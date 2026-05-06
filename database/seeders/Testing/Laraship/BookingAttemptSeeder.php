<?php

namespace Database\Seeders\Testing\Laraship;

use Illuminate\Database\Seeder;
use Susheelbhai\Laraship\Models\BookingAttempt;

class BookingAttemptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include __DIR__.'/data/data.php';
        BookingAttempt::insert($booking_attempts);
    }
}
