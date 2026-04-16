<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes to products table
        Schema::table('products', function (Blueprint $table) {
            $table->index(['product_category_id', 'is_active'], 'idx_products_category_active');
            $table->index(['is_active', 'price'], 'idx_products_active_price');
        });

        // Add indexes to order_items table
        Schema::table('order_items', function (Blueprint $table) {
            $table->index(['product_id', 'order_id'], 'idx_order_items_product');
            $table->index(['order_id', 'product_id'], 'idx_order_items_order');
        });

        // Add indexes to orders table
        Schema::table('orders', function (Blueprint $table) {
            $table->index(['payment_status', 'created_at'], 'idx_orders_payment_status');
            $table->index(['user_id', 'payment_status'], 'idx_orders_user');
        });

        // Add indexes to reviews table
        Schema::table('reviews', function (Blueprint $table) {
            $table->index(['product_id', 'status'], 'idx_reviews_product_status');
            $table->index(['status', 'rating'], 'idx_reviews_status_rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes from reviews table
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex('idx_reviews_product_status');
            $table->dropIndex('idx_reviews_status_rating');
        });

        // Drop indexes from orders table
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_payment_status');
            $table->dropIndex('idx_orders_user');
        });

        // Drop indexes from order_items table
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex('idx_order_items_product');
            $table->dropIndex('idx_order_items_order');
        });

        // Drop indexes from products table
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_category_active');
            $table->dropIndex('idx_products_active_price');
        });
    }
};
