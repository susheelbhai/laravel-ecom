<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dealer_retail_sales', function (Blueprint $table) {
            $table->string('customer_name')->nullable()->after('total_amount');
            $table->string('customer_email')->nullable()->after('customer_name');
            $table->string('customer_phone', 32)->nullable()->after('customer_email');
            $table->string('billing_address_line1')->nullable()->after('customer_phone');
            $table->string('billing_address_line2')->nullable()->after('billing_address_line1');
            $table->string('billing_city')->nullable()->after('billing_address_line2');
            $table->foreignId('billing_state_id')->nullable()->constrained('states')->nullOnDelete()->after('billing_city');
            $table->string('billing_pincode', 16)->nullable()->after('billing_state_id');
            $table->string('billing_country', 64)->nullable()->after('billing_pincode');
            $table->string('customer_gstin', 32)->nullable()->after('billing_country');
        });
    }

    public function down(): void
    {
        Schema::table('dealer_retail_sales', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'customer_email',
                'customer_phone',
                'billing_address_line1',
                'billing_address_line2',
                'billing_city',
                'billing_state_id',
                'billing_pincode',
                'billing_country',
                'customer_gstin',
            ]);
        });
    }
};
