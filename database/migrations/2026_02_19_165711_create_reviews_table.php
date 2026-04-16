<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Review content
            $table->tinyInteger('rating')->unsigned();
            $table->string('title')->nullable();
            $table->text('content');

            // Status and moderation
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            // Vote counts
            $table->unsignedInteger('helpful_count')->default(0);
            $table->unsignedInteger('not_helpful_count')->default(0);

            $table->timestamps();

            // Indexes for performance
            $table->index(['product_id', 'status'], 'idx_product_status');
            $table->index(['product_id', 'rating'], 'idx_product_rating');
            $table->index('user_id', 'idx_user');
            $table->index('created_at', 'idx_created_at');
        });

        // Add CHECK constraint using database-specific syntax
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE reviews ADD CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)');
        } elseif ($driver === 'sqlite') {
            // SQLite doesn't support adding CHECK constraints via ALTER TABLE
            // The constraint needs to be added during table creation
            // We'll handle validation at the application level for SQLite
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE reviews ADD CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
