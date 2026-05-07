<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('serial_numbers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();

            // The rack where this unit was stocked
            $table->foreignId('rack_id')->constrained('warehouse_racks')->cascadeOnDelete();

            // The stock movement that brought this unit in
            $table->foreignId('stock_movement_id')->nullable()->constrained('stock_movements')->nullOnDelete();

            $table->string('serial_number')->unique();

            // Status lifecycle: available → sold → stolen/damaged
            $table->enum('status', ['available', 'sold', 'stolen', 'damaged'])->default('available');

            $table->timestamps();

            $table->index(['product_id', 'status']);
            $table->index('rack_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('serial_numbers');
    }
};
