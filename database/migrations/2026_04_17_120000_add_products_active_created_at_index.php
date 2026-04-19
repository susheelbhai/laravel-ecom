<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Default catalog sort is `WHERE is_active = 1 ORDER BY created_at DESC` (see ProductController::index).
     * Without a matching composite index, large catalogs scan or filesort the whole table.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->index(['is_active', 'created_at'], 'idx_products_active_created_at');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_active_created_at');
        });
    }
};
