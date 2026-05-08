<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dealer_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('status')->default('placed');
            $table->foreignId('distributor_id')->constrained('distributors')->cascadeOnDelete();
            $table->foreignId('dealer_id')->constrained('dealers')->cascadeOnDelete();
            $table->foreignId('placed_by_distributor_id')->constrained('distributors')->cascadeOnDelete();
            $table->decimal('subtotal_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->timestamps();

            $table->index(['distributor_id', 'dealer_id']);
            $table->index('status');
        });

        Schema::create('dealer_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dealer_order_id')->constrained('dealer_orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('gst_rate', 5, 2)->default(0)->comment('GST % at time of order');
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2);
            $table->string('price_source')->default('product_distributor_price');
            $table->timestamps();

            $table->index(['dealer_order_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dealer_order_items');
        Schema::dropIfExists('dealer_orders');
    }
};

