<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE serial_numbers MODIFY COLUMN status ENUM('available','sold','stolen','damaged') NOT NULL DEFAULT 'available'");
        } else {
            // SQLite and other drivers: the column is already a string, so no structural change needed.
            // The application enforces valid values at the service layer.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE serial_numbers MODIFY COLUMN status ENUM('available','sold') NOT NULL DEFAULT 'available'");
        }
    }
};
