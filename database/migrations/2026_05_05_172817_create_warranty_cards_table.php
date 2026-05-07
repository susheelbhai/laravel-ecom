<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warranty_cards', function (Blueprint $table) {
            $table->id();

            // Unique warranty card number
            $table->string('card_number')->unique();

            // The retail sale this card belongs to
            $table->foreignId('dealer_retail_sale_id')->constrained('dealer_retail_sales')->cascadeOnDelete();

            // The specific line item (one card per unit sold)
            $table->foreignId('dealer_retail_sale_item_id')->constrained('dealer_retail_sale_items')->cascadeOnDelete();

            // The product
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();

            // The serial number of the unit sold
            $table->foreignId('serial_number_id')->nullable()->constrained('serial_numbers')->nullOnDelete();

            // The dealer who made the sale
            $table->foreignId('dealer_id')->constrained('dealers')->cascadeOnDelete();

            // Warranty period
            $table->date('purchase_date');
            $table->date('warranty_expires_at');

            // Snapshot of terms at time of sale (in case product terms change later)
            $table->longText('terms_snapshot')->nullable();

            $table->timestamps();

            $table->index('dealer_retail_sale_id');
            $table->index('dealer_id');
            $table->index('warranty_expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warranty_cards');
    }
};
