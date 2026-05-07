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
        Schema::create('distributor_order_item_serial_numbers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distributor_order_item_id')
                ->constrained('distributor_order_items', indexName: 'doi_sn_distributor_order_item_id_foreign')
                ->cascadeOnDelete();
            $table->foreignId('serial_number_id')
                ->constrained('serial_numbers', indexName: 'doi_sn_serial_number_id_foreign')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['distributor_order_item_id', 'serial_number_id'], 'doi_sn_unique');
            $table->index('serial_number_id', 'doi_sn_serial_number_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distributor_order_item_serial_numbers');
    }
};
