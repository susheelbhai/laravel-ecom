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
            $table->fullText(
                ['title', 'short_description'],
                'ft_products_title_short_description',
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
            $table->dropFullText('ft_products_title_short_description');
        });
    }
};

