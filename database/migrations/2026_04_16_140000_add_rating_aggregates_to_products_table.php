<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('rating_sum')->default(0)->after('features');
            $table->unsignedInteger('review_count')->default(0)->after('rating_sum');
            $table->decimal('average_rating', 3, 2)->default(0)->after('review_count');

            $table->index(['is_active', 'average_rating'], 'idx_products_active_average_rating');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_active_average_rating');
            $table->dropColumn(['rating_sum', 'review_count', 'average_rating']);
        });
    }
};
