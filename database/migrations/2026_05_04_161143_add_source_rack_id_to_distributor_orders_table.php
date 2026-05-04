<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distributor_orders', function (Blueprint $table) {
            // Nullable — set by admin when approving a distributor-placed order.
            $table->foreignId('source_rack_id')
                ->nullable()
                ->after('source_warehouse_id')
                ->constrained('warehouse_racks')
                ->nullOnDelete();

            // Track who approved / rejected and when.
            $table->foreignId('approved_by_admin_id')
                ->nullable()
                ->after('placed_by_distributor_id')
                ->constrained('admins')
                ->nullOnDelete();

            $table->foreignId('rejected_by_admin_id')
                ->nullable()
                ->after('approved_by_admin_id')
                ->constrained('admins')
                ->nullOnDelete();

            $table->text('rejection_note')->nullable()->after('rejected_by_admin_id');
            $table->timestamp('approved_at')->nullable()->after('rejection_note');
            $table->timestamp('rejected_at')->nullable()->after('approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('distributor_orders', function (Blueprint $table) {
            $table->dropForeign(['source_rack_id']);
            $table->dropForeign(['approved_by_admin_id']);
            $table->dropForeign(['rejected_by_admin_id']);
            $table->dropColumn([
                'source_rack_id',
                'approved_by_admin_id',
                'rejected_by_admin_id',
                'rejection_note',
                'approved_at',
                'rejected_at',
            ]);
        });
    }
};
