<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('gstin', 15)->nullable()->after('address');
            $table->foreignId('state_id')->nullable()->constrained('states')->nullOnDelete()->after('gstin');
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropForeign(['state_id']);
            $table->dropColumn(['gstin', 'state_id']);
        });
    }
};
