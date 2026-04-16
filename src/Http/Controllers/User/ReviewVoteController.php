<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\VoteReviewRequest;
use App\Models\Review;
use App\Models\ReviewVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewVoteController extends Controller
{
    /**
     * Vote on a review (helpful/not helpful).
     */
    public function vote(VoteReviewRequest $request, Review $review): JsonResponse
    {
        $user = $request->user();

        // Prevent users from voting on their own reviews
        if ($review->user_id === $user->id) {
            return response()->json([
                'message' => 'You cannot vote on your own review.',
            ], 403);
        }

        $voteType = $request->validated()['vote_type'];

        DB::transaction(function () use ($review, $user, $voteType) {
            // Check if user already voted
            $existingVote = ReviewVote::where('review_id', $review->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingVote) {
                // Update existing vote
                $oldVoteType = $existingVote->vote_type;

                if ($oldVoteType !== $voteType) {
                    // Decrement old vote count
                    if ($oldVoteType === 'helpful') {
                        $review->decrement('helpful_count');
                    } else {
                        $review->decrement('not_helpful_count');
                    }

                    // Increment new vote count
                    if ($voteType === 'helpful') {
                        $review->increment('helpful_count');
                    } else {
                        $review->increment('not_helpful_count');
                    }

                    $existingVote->update(['vote_type' => $voteType]);
                }
            } else {
                // Create new vote
                ReviewVote::create([
                    'review_id' => $review->id,
                    'user_id' => $user->id,
                    'vote_type' => $voteType,
                ]);

                // Increment vote count
                if ($voteType === 'helpful') {
                    $review->increment('helpful_count');
                } else {
                    $review->increment('not_helpful_count');
                }
            }
        });

        $review->refresh();

        return response()->json([
            'message' => 'Vote recorded successfully.',
            'helpful_count' => $review->helpful_count,
            'not_helpful_count' => $review->not_helpful_count,
        ]);
    }

    /**
     * Remove a vote.
     */
    public function removeVote(Review $review): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $vote = ReviewVote::where('review_id', $review->id)
            ->where('user_id', $user->id)
            ->first();

        if ($vote) {
            DB::transaction(function () use ($review, $vote) {
                // Decrement vote count
                if ($vote->vote_type === 'helpful') {
                    $review->decrement('helpful_count');
                } else {
                    $review->decrement('not_helpful_count');
                }

                $vote->delete();
            });

            $review->refresh();

            return response()->json([
                'message' => 'Vote removed successfully.',
                'helpful_count' => $review->helpful_count,
                'not_helpful_count' => $review->not_helpful_count,
            ]);
        }

        return response()->json([
            'message' => 'No vote found to remove.',
        ], 404);
    }
}
