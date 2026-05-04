<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->string('owner_type')->nullable()->after('pincode');
            $table->unsignedBigInteger('owner_id')->nullable()->after('owner_type');

            $table->index(['owner_type', 'owner_id']);
        });

        // Existing warehouses are admin-owned stock locations.
        DB::table('warehouses')->whereNull('owner_type')->update(['owner_type' => 'admin']);
    }

    public function down(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->dropIndex(['owner_type', 'owner_id']);
            $table->dropColumn(['owner_type', 'owner_id']);
        });
    }
};

