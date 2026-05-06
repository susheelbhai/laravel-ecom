<?php

namespace Database\Seeders\Testing;

use App\Models\WishlistItem;
use Illuminate\Database\Seeder;

class WishlistItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include __DIR__.'/data/data.php';
        WishlistItem::insert($wishlist_items);
    }
}
