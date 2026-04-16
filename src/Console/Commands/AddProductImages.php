<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class AddProductImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:add-images 
                            {--limit=100 : Number of products to process}
                            {--batch=10 : Batch size for processing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add 3-5 random images to products';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $limit = (int) $this->option('limit');
        $batchSize = (int) $this->option('batch');

        // Get products without images
        $products = Product::doesntHave('media')
            ->limit($limit)
            ->get();

        if ($products->isEmpty()) {
            $this->info('No products found without images.');

            return self::SUCCESS;
        }

        $this->info("Processing {$products->count()} products...");
        $progressBar = $this->output->createProgressBar($products->count());
        $progressBar->start();

        $products->chunk($batchSize)->each(function ($chunk) use ($progressBar) {
            foreach ($chunk as $product) {
                $imageCount = rand(1, 3);

                for ($i = 0; $i < $imageCount; $i++) {
                    $width = rand(400, 800);
                    $height = rand(400, 800);
                    $seed = $product->id.'-'.$i;
                    $imageUrl = "https://picsum.photos/seed/{$seed}/{$width}/{$height}";

                    try {
                        $product
                            ->addMediaFromUrl($imageUrl)
                            ->toMediaCollection('images');
                    } catch (\Exception $e) {
                        $this->error("\nFailed to add image for product {$product->id}: {$e->getMessage()}");

                        continue;
                    }
                }

                $progressBar->advance();
            }
        });

        $progressBar->finish();
        $this->newLine();
        $this->info('✓ Images added successfully!');

        // Check remaining products
        $remaining = Product::doesntHave('media')->count();
        if ($remaining > 0) {
            $this->info("Remaining products without images: {$remaining}");
            $this->info('Run the command again to process more products.');
        }

        return self::SUCCESS;
    }
}
