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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('address_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->string('payment_gateway_order_id')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('pending'); // pending, processing, completed, cancelled
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('pending'); // pending, paid, failed
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
