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
        Schema::create('kpis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('strategic_objective_id')->constrained('strategic_objectives')->cascadeOnDelete();
            $table->foreignId('owner_id')->constrained('users');
            $table->string('name');
            $table->text('formula')->nullable(); // Fórmula de cálculo en texto
            $table->string('unit', 20); // %, $, #, días, etc.
            $table->enum('frequency', ['daily', 'monthly', 'quarterly', 'annual'])->default('monthly');
            $table->decimal('target', 15, 2); // Meta
            $table->decimal('threshold_green', 5, 2)->default(0.95); // ej: 0.95 = 95% de la meta
            $table->decimal('threshold_yellow', 5, 2)->default(0.80); // ej: 0.80 = 80% de la meta
            $table->boolean('active')->default(true);
            $table->boolean('audit_trail')->default(false); // true para KPIs financieros
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['strategic_objective_id', 'active']);
            $table->index('owner_id');
            $table->index(['frequency', 'active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpis');
    }
};
