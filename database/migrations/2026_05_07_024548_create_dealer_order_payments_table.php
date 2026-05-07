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
        Schema::create('dealer_order_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dealer_order_id')
                ->constrained('dealer_orders')
                ->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('payment_method');
            $table->text('note')->nullable();
            $table->foreignId('recorded_by_distributor_id')
                ->nullable()
                ->constrained('distributors')
                ->nullOnDelete();
            $table->timestamps();

            $table->index('dealer_order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dealer_order_payments');
    }
};
