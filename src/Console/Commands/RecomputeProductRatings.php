<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RecomputeProductRatings extends Command
{
    protected $signature = 'products:recompute-ratings {--chunk=1000}';

    protected $description = 'Recompute products rating_sum, review_count, average_rating from approved reviews';

    public function handle(): int
    {
        $chunk = (int) $this->option('chunk');
        $chunk = $chunk > 0 ? $chunk : 1000;

        $this->info('Resetting rating aggregates to 0...');
        DB::table('products')->update([
            'rating_sum' => 0,
            'review_count' => 0,
            'average_rating' => 0,
        ]);

        $this->info('Aggregating approved reviews...');
        $rows = DB::table('reviews')
            ->where('status', 'approved')
            ->selectRaw('product_id, SUM(rating) as rating_sum, COUNT(*) as review_count')
            ->groupBy('product_id')
            ->orderBy('product_id')
            ->get();

        $this->info('Updating products...');
        $bar = $this->output->createProgressBar(max(1, $rows->count()));
        $bar->start();

        $buffer = [];
        foreach ($rows as $row) {
            $buffer[] = $row;
            if (count($buffer) >= $chunk) {
                $this->flushBuffer($buffer);
                $bar->advance(count($buffer));
                $buffer = [];
            }
        }
        if ($buffer !== []) {
            $this->flushBuffer($buffer);
            $bar->advance(count($buffer));
        }

        $bar->finish();
        $this->newLine(2);
        $this->info('✓ Done');

        return self::SUCCESS;
    }

    private function flushBuffer(array $buffer): void
    {
        foreach ($buffer as $row) {
            $sum = (int) ($row->rating_sum ?? 0);
            $count = (int) ($row->review_count ?? 0);
            $avg = $count > 0 ? round($sum / $count, 2) : 0;

            DB::table('products')
                ->where('id', $row->product_id)
                ->update([
                    'rating_sum' => $sum,
                    'review_count' => $count,
                    'average_rating' => $avg,
                ]);
        }
    }
}
