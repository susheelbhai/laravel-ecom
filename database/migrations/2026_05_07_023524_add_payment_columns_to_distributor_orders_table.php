<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distributor_orders', function (Blueprint $table) {
            $table->string('payment_status')->default('unpaid')->after('total_amount');
            $table->decimal('amount_paid', 10, 2)->default(0)->after('payment_status');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::table('distributor_orders', function (Blueprint $table) {
            $table->dropIndex(['payment_status']);
            $table->dropColumn(['payment_status', 'amount_paid']);
        });
    }
};
