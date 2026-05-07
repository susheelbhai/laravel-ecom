<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distributors', function (Blueprint $table) {
            $table->decimal('commission_percentage', 5, 2)->default(0)->after('rejection_note');
        });

        Schema::table('dealers', function (Blueprint $table) {
            $table->decimal('commission_percentage', 5, 2)->default(0)->after('rejection_note');
        });
    }

    public function down(): void
    {
        Schema::table('distributors', function (Blueprint $table) {
            $table->dropColumn('commission_percentage');
        });

        Schema::table('dealers', function (Blueprint $table) {
            $table->dropColumn('commission_percentage');
        });
    }
};
