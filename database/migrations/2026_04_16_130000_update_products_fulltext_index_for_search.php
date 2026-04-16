<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        if (! in_array($driver, ['mysql', 'mariadb'], true)) {
            return;
        }

        Schema::table('products', function (Blueprint $table) {
            // Old index kept for backward compatibility; new index optimised for current search query.
            $table->fullText(
                ['title', 'short_description', 'sku'],
                'ft_products_search',
            );
        });
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        if (! in_array($driver, ['mysql', 'mariadb'], true)) {
            return;
        }

        Schema::table('products', function (Blueprint $table) {
            $table->dropFullText('ft_products_search');
        });
    }
};
