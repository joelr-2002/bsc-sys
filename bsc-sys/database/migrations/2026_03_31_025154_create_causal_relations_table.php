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
        Schema::create('causal_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cause_objective_id')->constrained('strategic_objectives')->cascadeOnDelete();
            $table->foreignId('effect_objective_id')->constrained('strategic_objectives')->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->integer('strength')->default(5); // 1-10, fuerza de la relación
            $table->timestamps();

            $table->unique(['cause_objective_id', 'effect_objective_id']);
            $table->index('effect_objective_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('causal_relations');
    }
};
