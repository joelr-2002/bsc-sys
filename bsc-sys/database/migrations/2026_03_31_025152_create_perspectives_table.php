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
        Schema::create('perspectives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('strategic_plan_id')->constrained('strategic_plans')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['financial', 'customer', 'process', 'learning', 'custom'])->default('custom');
            $table->integer('order')->default(0);
            $table->boolean('active')->default(true);
            $table->text('description')->nullable();
            $table->string('color', 7)->nullable(); // Hex color #RRGGBB
            $table->timestamps();
            $table->softDeletes();

            $table->index(['strategic_plan_id', 'active', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perspectives');
    }
};
