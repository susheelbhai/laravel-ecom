<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReviewVote>
 */
class ReviewVoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'review_id' => \App\Models\Review::factory(),
            'user_id' => \App\Models\User::factory(),
            'vote_type' => fake()->randomElement(['helpful', 'not_helpful']),
        ];
    }

    /**
     * Indicate that the vote is helpful.
     */
    public function helpful(): static
    {
        return $this->state(fn (array $attributes) => [
            'vote_type' => 'helpful',
        ]);
    }

    /**
     * Indicate that the vote is not helpful.
     */
    public function notHelpful(): static
    {
        return $this->state(fn (array $attributes) => [
            'vote_type' => 'not_helpful',
        ]);
    }
}
