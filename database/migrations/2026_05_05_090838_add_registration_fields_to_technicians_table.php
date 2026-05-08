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
        Schema::table('technicians', function (Blueprint $table) {
            $table->string('specialization')->nullable()->after('phone');
            $table->string('experience_years')->nullable()->after('specialization');
            $table->string('certification')->nullable()->after('experience_years');
            $table->longText('address')->nullable()->after('certification');
            $table->string('city')->nullable()->after('address');
            $table->foreignId('state_id')->nullable()->constrained('states')->nullOnDelete()->after('city');
            $table->string('pincode', 10)->nullable()->after('state_id');
            $table->string('id_type')->nullable()->after('pincode');
            $table->string('id_number')->nullable()->after('id_type');
            $table->string('referral_source')->nullable()->after('id_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('technicians', function (Blueprint $table) {
            $table->dropColumn([
                'specialization',
                'experience_years',
                'certification',
                'address',
                'city',
                'state_id',
                'pincode',
                'id_type',
                'id_number',
                'referral_source',
            ]);
        });
    }
};
