<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dealer_retail_sales', function (Blueprint $table) {
            $table->id();
            $table->string('sale_number')->unique();
            $table->string('status')->default('completed');
            $table->foreignId('dealer_id')->constrained('dealers')->cascadeOnDelete();
            $table->foreignId('created_by_dealer_id')->constrained('dealers')->cascadeOnDelete();
            $table->decimal('subtotal_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->timestamps();

            $table->index('dealer_id');
            $table->index('status');
        });

        Schema::create('dealer_retail_sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dealer_retail_sale_id')->constrained('dealer_retail_sales')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();

            $table->index(['dealer_retail_sale_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dealer_retail_sale_items');
        Schema::dropIfExists('dealer_retail_sales');
    }
};

