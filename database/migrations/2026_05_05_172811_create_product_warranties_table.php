<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_warranties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->unique()->constrained('products')->cascadeOnDelete();

            // Duration: e.g. 1 year, 6 months, 24 months
            $table->unsignedSmallInteger('duration')->default(1);
            $table->enum('duration_unit', ['days', 'months', 'years'])->default('years');

            // Terms & conditions shown on the warranty card
            $table->longText('terms')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_warranties');
    }
};
