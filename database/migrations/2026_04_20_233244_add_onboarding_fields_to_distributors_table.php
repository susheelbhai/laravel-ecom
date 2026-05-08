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
        Schema::table('distributors', function (Blueprint $table) {
            $table->string('legal_business_name')->nullable()->after('name');
            $table->string('trade_name')->nullable()->after('legal_business_name');
            $table->string('business_constitution', 64)->nullable()->after('trade_name');
            $table->string('kyc_id_type', 32)->nullable()->after('business_constitution');
            $table->string('kyc_id_number', 64)->nullable()->after('kyc_id_type');
            $table->string('pan_number', 10)->nullable()->after('kyc_id_number');
            $table->string('gstin', 15)->nullable()->after('pan_number');
            $table->string('pincode', 12)->nullable()->after('state_id');
            $table->text('warehouse_address')->nullable()->after('address');
            $table->string('tan_number', 20)->nullable()->after('gstin');
            $table->string('msme_udyam_number', 32)->nullable()->after('tan_number');
            $table->text('nature_of_business')->nullable()->after('msme_udyam_number');
            $table->unsignedTinyInteger('years_in_business')->nullable()->after('nature_of_business');
            $table->string('expected_monthly_purchase_band', 32)->nullable()->after('years_in_business');
            $table->string('referral_source', 255)->nullable()->after('expected_monthly_purchase_band');
            $table->string('authorized_signatory_designation', 128)->nullable()->after('referral_source');
            $table->string('bank_account_holder_name')->nullable()->after('authorized_signatory_designation');
            $table->string('bank_name')->nullable()->after('bank_account_holder_name');
            $table->string('bank_branch')->nullable()->after('bank_name');
            $table->string('bank_account_number', 34)->nullable()->after('bank_branch');
            $table->string('bank_ifsc', 11)->nullable()->after('bank_account_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('distributors', function (Blueprint $table) {
            $table->dropColumn([
                'legal_business_name',
                'trade_name',
                'business_constitution',
                'kyc_id_type',
                'kyc_id_number',
                'pan_number',
                'gstin',
                'pincode',
                'warehouse_address',
                'tan_number',
                'msme_udyam_number',
                'nature_of_business',
                'years_in_business',
                'expected_monthly_purchase_band',
                'referral_source',
                'authorized_signatory_designation',
                'bank_account_holder_name',
                'bank_name',
                'bank_branch',
                'bank_account_number',
                'bank_ifsc',
            ]);
        });
    }
};
