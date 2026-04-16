<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ProductFakeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $target = 1_00_000; // total desired products in DB
        // MySQL has a limit on the number of placeholders per prepared statement.
        // Keep this low enough to avoid "Prepared statement contains too many placeholders".
        $chunkSize = 2_000;

        $existingCount = (int) DB::table('products')->count();
        $toCreate = max(0, $target - $existingCount);
        $baseId = (int) (DB::table('products')->max('id') ?? 0);

        if ($toCreate === 0) {
            $this->command->info("Products already seeded: {$existingCount}/{$target}. Nothing to do.");

            return;
        }

        $this->command->info("Creating {$toCreate} products (current: {$existingCount}, target: {$target})...");

        // Get existing categories
        $categoryIds = ProductCategory::pluck('id')->toArray();

        if (empty($categoryIds)) {
            $this->command->error('No product categories found. Please run ProductCategorySeeder first.');

            return;
        }

        $now = now();
        $productColumns = array_flip(Schema::getColumnListing('products'));

        $shortSnippets = [
            'Reliable quality for daily use. Ships fast.',
            'Customer favourite — great value and solid build.',
            'Designed for comfort and long-term durability.',
            'Versatile pick that fits most setups.',
            'Premium feel without the premium hassle.',
        ];

        $featurePool = [
            'Thoughtfully balanced weight for comfortable handling',
            'Materials selected for everyday wear and easy upkeep',
            'Fits a wide range of spaces without dominating the room',
            'Smooth, consistent finish that resists minor scuffs',
            'Hardware and fittings included where applicable',
            'Designed to pair cleanly with other items in the catalog',
            'Packaging optimised to reduce transit damage',
            'Straightforward assembly with clear orientation cues',
            'Ventilation and airflow considered in the layout',
            'Edges and corners softened for safer day-to-day use',
            'Tested against common household humidity swings',
            'Colour-fast surfaces under typical indoor lighting',
            'Modular touches so you can adapt the setup later',
            'Backed by sample QA notes for development storefronts',
            'Compatible with standard accessories in this category',
            'Low-fuss maintenance — wipe down and air dry',
        ];

        // Bulk insert in chunks for speed (Eloquent factories would be far too slow for 1,000,000).
        for ($offset = 0; $offset < $toCreate; $offset += $chunkSize) {
            $rows = [];
            $limit = min($chunkSize, $toCreate - $offset);

            for ($i = 0; $i < $limit; $i++) {
                $n = $baseId + $offset + $i + 1;
                $title = "Product {$n}";

                // Ensure unique slug without DB queries.
                $slug = 'product-'.$n.'-'.Str::lower(Str::random(6));

                // Keep SKU unique and short enough.
                $sku = 'SKU'.str_pad((string) $n, 10, '0', STR_PAD_LEFT);

                $priceCents = random_int(499, 999_999); // ₹4.99 – ₹9,999.99
                $price = round($priceCents / 100, 2);
                $markupPct = random_int(5, 50);
                $mrp = round($price * (1 + $markupPct / 100), 2);

                $short_description = $shortSnippets[$n % count($shortSnippets)]
                    ." Ideal for staging carts, search, and category pages. Full details below. ({$title})";

                $featureCount = 3;
                $features = [];
                $poolCount = count($featurePool);
                for ($f = 0; $f < $featureCount; $f++) {
                    $features[] = $featurePool[($n + $f * 5) % $poolCount];
                }

                $description = <<<TXT
## Overview
{$title} is placeholder catalog content for local development and performance testing. The copy
is intentionally verbose so you can validate rich-text renderers, truncation, accordions, and SEO
previews without shipping real inventory. Treat every statement here as fictional.

## Why this dummy listing exists
We generate these rows to stress pagination, filters, and indexing. You should see a mix of
prices, categories, and SKUs such as {$sku} so that spreadsheets, exports, and admin grids have
realistic density. None of the claims below constitute a commercial warranty or specification sheet.

## What shoppers would read (sample)
Expect language about dependable materials, predictable care routines, and a silhouette that
works in typical homes or offices. The goal is readable paragraphs—not bullet-perfect marketing—so
designers can tune line height, paragraph spacing, and heading styles with confidence.

## Fit and compatibility
This item is described generically so merchandising teams can remap it to true attributes later.
If your theme shows badges, use this section to confirm they wrap correctly when the copy runs long.
Cross-links to related categories should still read naturally beside this block.

## Care and handling (fictional)
For dummy data only: dust gently, avoid prolonged soaking, and store away from extreme heat unless
your real product requires otherwise. Replace this entire section before launch.

## Inventory note
SKU {$sku} is unique in this seed batch. Stock numbers, warehouses, and fulfilment rules are not
simulated here—wire those up in your integration layer.

## Compliance placeholder
When you go live, add certifications, country-of-origin, and safety warnings as required. This
seeder does not insert legal text.
TXT;

                $long_description2 = <<<TXT
### Extended story (still fake)
Imagine a product team iterating on {$title}: early sketches, material swatches, and packaging
dummies. This second column mimics the "read more" expansion some themes show beneath the fold.
It is long on purpose—use it to test lazy loading, sticky sidebars, and mobile scroll behaviour.

### Field notes for QA
- Confirm headings degrade gracefully if your renderer strips Markdown.
- Check that screen readers encounter a sensible order when both columns load.
- Verify print stylesheets do not clip this section.

### Repeat SKU reminder
Reference: {$sku}. If duplicate slugs ever appear, re-run migrations or inspect the seed loop;
this generator uses random suffixes on the slug but deterministic SKUs.
TXT;

                $long_description3 = <<<TXT
### Technical-style appendix (sample)
**Model:** {$title} (seed #{$n})
**Sample dimensions:** {$n} × "placeholder" × units — replace with real measurements.
**Power / connectivity:** Not applicable unless you extend this seeder.
**Environmental:** Fictional carbon note for layout testing only.

### Revision history (lorem)
v0.3 — Expanded copy for storefront QA.
v0.2 — Added feature bullets via JSON.
v0.1 — Initial bulk insert.

### Closing
All pricing is randomised for development. Replace descriptions, features, and metadata before
any public release.
TXT;

                $rows[] = [
                    'seller_id' => null,
                    'product_category_id' => $categoryIds[array_rand($categoryIds)],
                    'title' => $title,
                    'slug' => $slug,
                    'sku' => $sku,
                    'short_description' => $short_description,
                    'description' => $description,
                    'long_description2' => $long_description2,
                    'long_description3' => $long_description3,
                    'features' => json_encode($features),
                    'price' => $price,
                    'original_price' => $mrp,
                    'mrp' => $mrp,
                    'manage_stock' => 1,
                    'is_active' => 1,
                    'is_featured' => 0,
                    'meta_title' => null,
                    'meta_description' => null,
                    'created_by_admin_id' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $rows[array_key_last($rows)] = array_intersect_key(
                    $rows[array_key_last($rows)],
                    $productColumns,
                );
            }

            DB::table('products')->insert($rows);

            $done = min($offset + $limit, $toCreate);
            $this->command->info("Inserted {$done}/{$toCreate}...");
        }

        $this->command->info("✓ {$toCreate} products created successfully!");
        $this->command->newLine();
        $this->command->info('To add images to products, run:');
        $this->command->info('  php artisan products:add-images');
    }
}
