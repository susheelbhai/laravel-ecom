<?php

namespace Database\Seeders;

use App\Models\WishlistItem;
use Illuminate\Database\Seeder;

class WishlistItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        WishlistItem::insert($wishlist_items);
    }
}
