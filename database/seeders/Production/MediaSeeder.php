<?php

namespace Database\Seeders\Production;

use App\Models\MediaExternal;
use App\Models\MediaInternal;
use Illuminate\Database\Seeder;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        include 'data/data.php';
        Media::insert($media);
        MediaExternal::insert($media_external);
        MediaInternal::insert($media_internal);
    }
}
