<?php

namespace Database\Seeders\Testing;

use App\Models\ReviewVote;
use Illuminate\Database\Seeder;

class ReviewVoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        ReviewVote::insert($review_votes);
    }
}
