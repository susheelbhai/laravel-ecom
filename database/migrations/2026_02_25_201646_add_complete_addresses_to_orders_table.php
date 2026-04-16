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
        Schema::table('orders', function (Blueprint $table) {
            // Shipping address fields (customer delivery address)
            $table->string('shipping_full_name')->nullable()->after('address_id');
            $table->string('shipping_phone')->nullable();
            $table->string('shipping_alternate_phone')->nullable();
            $table->text('shipping_address_line1')->nullable();
            $table->text('shipping_address_line2')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_state')->nullable();
            $table->string('shipping_country')->nullable();
            $table->string('shipping_pincode')->nullable();
            $table->string('shipping_landmark')->nullable();

            // Pickup address fields (warehouse address)
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null');
            $table->string('pickup_name')->nullable();
            $table->string('pickup_phone')->nullable();
            $table->string('pickup_email')->nullable();
            $table->text('pickup_address_line1')->nullable();
            $table->text('pickup_address_line2')->nullable();
            $table->string('pickup_city')->nullable();
            $table->string('pickup_state')->nullable();
            $table->string('pickup_country')->nullable();
            $table->string('pickup_pincode')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn([
                'shipping_full_name',
                'shipping_phone',
                'shipping_alternate_phone',
                'shipping_address_line1',
                'shipping_address_line2',
                'shipping_city',
                'shipping_state',
                'shipping_country',
                'shipping_pincode',
                'shipping_landmark',
                'warehouse_id',
                'pickup_name',
                'pickup_phone',
                'pickup_email',
                'pickup_address_line1',
                'pickup_address_line2',
                'pickup_city',
                'pickup_state',
                'pickup_country',
                'pickup_pincode',
            ]);
        });
    }
};
