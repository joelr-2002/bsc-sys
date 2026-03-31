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
        Schema::create('kpi_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kpi_id')->constrained('kpis')->cascadeOnDelete();
            $table->foreignId('measurement_period_id')->constrained('measurement_periods');
            $table->foreignId('loaded_by_user_id')->constrained('users');
            $table->decimal('value', 15, 2);
            $table->enum('traffic_light', ['green', 'yellow', 'red', 'grey'])->default('grey');
            $table->enum('source_type', ['manual', 'excel', 'connector', 'api'])->default('manual');
            $table->string('source_id')->nullable(); // ID del conector si aplica
            $table->boolean('superseded')->default(false); // Inmutable: no se borra, solo se marca como superseded
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['kpi_id', 'measurement_period_id', 'superseded'], 'kpi_period_unique');
            $table->index(['kpi_id', 'traffic_light']);
            $table->index('measurement_period_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpi_values');
    }
};
