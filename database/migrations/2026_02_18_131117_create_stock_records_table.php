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
        Schema::create('stock_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('rack_id')->constrained('warehouse_racks')->onDelete('cascade');
            $table->integer('quantity')->unsigned();
            $table->timestamps();

            $table->unique(['product_id', 'rack_id']);
            $table->index('product_id');
            $table->index('rack_id');
            $table->index(['product_id', 'rack_id']);
        });

        // Add check constraint using database-specific syntax
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE stock_records ADD CONSTRAINT check_quantity_non_negative CHECK (quantity >= 0)');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE stock_records ADD CONSTRAINT check_quantity_non_negative CHECK (quantity >= 0)');
        } elseif ($driver === 'sqlite') {
            // SQLite check constraints must be added during table creation
            // Since we can't alter the table, we'll rely on application-level validation
            // and the unsigned() constraint which prevents negative values
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_records');
    }
};
