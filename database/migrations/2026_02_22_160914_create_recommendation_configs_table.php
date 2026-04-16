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
        Schema::create('recommendation_configs', function (Blueprint $table) {
            $table->id();
            $table->string('section_type', 50)->unique();
            $table->boolean('is_enabled')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index(['is_enabled', 'display_order'], 'idx_enabled_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendation_configs');
    }
};
