<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dealer_orders', function (Blueprint $table) {
            $table->decimal('tax_amount', 10, 2)->default(0)->after('subtotal_amount');
        });

        Schema::table('dealer_order_items', function (Blueprint $table) {
            $table->decimal('gst_rate', 5, 2)->default(0)->after('unit_price')->comment('GST % at time of order');
            $table->decimal('tax_amount', 10, 2)->default(0)->after('gst_rate');
        });
    }

    public function down(): void
    {
        Schema::table('dealer_orders', function (Blueprint $table) {
            $table->dropColumn('tax_amount');
        });

        Schema::table('dealer_order_items', function (Blueprint $table) {
            $table->dropColumn(['gst_rate', 'tax_amount']);
        });
    }
};
