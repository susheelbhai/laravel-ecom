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
        Schema::create('serial_number_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('serial_number_id')->constrained('serial_numbers')->cascadeOnDelete();

            // Event type: stock_in | distributor_order | dealer_order | retail_sale | stolen | damaged | rack_transfer
            $table->string('event_type');

            // Polymorphic reference to the source document
            // (StockMovement, DistributorOrderItem, DealerOrderItem, DealerRetailSaleItem)
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();

            // Polymorphic actor (Admin, Distributor, Dealer, Customer, Technician)
            $table->string('actor_type')->nullable();
            $table->unsignedBigInteger('actor_id')->nullable();

            // Human-readable snapshot of where the item moved from/to
            $table->string('from_party')->nullable();
            $table->string('to_party')->nullable();

            // Optional reason/description (used for stolen events and other notes)
            $table->text('notes')->nullable();

            $table->timestamp('occurred_at');
            $table->timestamps();

            $table->index('serial_number_id');
            $table->index(['reference_type', 'reference_id']);
            $table->index('occurred_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('serial_number_movements');
    }
};
