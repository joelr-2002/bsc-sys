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
        Schema::create('measurement_periods', function (Blueprint $table) {
            $table->id();
            $table->integer('year');
            $table->integer('month')->nullable(); // null para periodos anuales
            $table->integer('quarter')->nullable(); // null para periodos mensuales (1-4)
            $table->enum('status', ['open', 'closed', 'locked'])->default('open');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();

            $table->unique(['year', 'month', 'quarter']);
            $table->index(['year', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('measurement_periods');
    }
};
